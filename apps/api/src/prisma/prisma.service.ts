import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@college-erp/prisma';
import { getTenantId } from '../tenant/tenant.context';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  public originalClient: PrismaClient;

  // The extended client logic wrapped in a property if needed,
  // or we can just apply an extension directly to `this` instance.
  // Using $extends transforms the type, so commonly NestJS Prisma extensions are tricky with DI.
  // Best approach for NestJS: Keep `this` as the injected service, and provide an `xprisma` getter for typed operations.

  constructor() {
    super();
    this.originalClient = new PrismaClient();
  }

  get xclient() {
    const originalClient = this.originalClient;

    return this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const tenantId = getTenantId();

            // Models that don't have tenant_id
            const globalModels = ['Tenant'];
            if (tenantId && !globalModels.includes(model)) {
              // Rewrite findUnique to findFirst to allow injecting tenant_id
              if (operation === 'findUnique') {
                operation = 'findFirst';
              } else if (operation === 'findUniqueOrThrow') {
                operation = 'findFirstOrThrow';
              }

              if (
                operation === 'create' ||
                operation === 'createMany' ||
                operation === 'update' ||
                operation === 'updateMany'
              ) {
                // Inject tenantId to data
                const mutableArgs = args as any;
                if (mutableArgs.data) {
                  if (Array.isArray(mutableArgs.data)) {
                    mutableArgs.data = mutableArgs.data.map((d: any) => ({
                      ...d,
                      tenant_id: tenantId,
                    }));
                  } else {
                    mutableArgs.data = {
                      ...mutableArgs.data,
                      tenant_id: tenantId,
                    };
                  }
                }
              }

              if (
                operation === 'findFirst' ||
                operation === 'findFirstOrThrow' ||
                operation === 'findMany' ||
                operation === 'update' ||
                operation === 'updateMany' ||
                operation === 'delete' ||
                operation === 'deleteMany' ||
                operation === 'count' ||
                operation === 'aggregate' ||
                operation === 'groupBy'
              ) {
                // Inject tenantId to where clause
                const mutableArgs = args as any;
                mutableArgs.where = {
                  ...(mutableArgs.where || {}),
                  tenant_id: tenantId,
                };
              }
            }

            // Global Soft Delete & Pagination Enforcement
            if ((model as string) !== 'AuditLog') {
              const mutableArgs = args as any;
              
              const readOps = ['findFirst', 'findFirstOrThrow', 'findMany', 'count', 'aggregate', 'groupBy'];
              if (readOps.includes(operation)) {
                mutableArgs.where = {
                  ...(mutableArgs.where || {}),
                  is_deleted: false,
                };
              }

              // Guard against massive unpaginated queries
              if (operation === 'findMany') {
                if (mutableArgs.take === undefined) {
                  mutableArgs.take = 100;
                }
              }
            }

            const result = await query(args);

            // Audit Logging for mutations
            if (tenantId && !globalModels.includes(model) && (model as string) !== 'AuditLog') {
              const mutationOps = ['create', 'update', 'delete', 'createMany', 'updateMany', 'deleteMany'];
              if (mutationOps.includes(operation)) {
                const changes = (args as any).data || null;
                const entityId = (result as any)?.id ? (result as any).id.toString() : 'bulk_operation';
                
                // Fire and forget audit log to not block the response
                (originalClient as any).auditLog.create({
                  data: {
                    tenant_id: tenantId,
                    action: operation.toUpperCase(),
                    entity: model as string,
                    entity_id: entityId,
                    changes: changes ? JSON.stringify(changes) : null,
                  }
                }).catch((e: Error) => console.error("Failed to write audit log:", e));
              }
            }

            return result;
          },
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    await this.originalClient.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.originalClient.$disconnect();
  }
}
