import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@college-erp/prisma';
import { getTenantId } from '../tenant/tenant.context';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
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
        return this.$extends({
            query: {
                $allModels: {
                    async $allOperations({ model, operation, args, query }) {
                        const tenantId = getTenantId();

                        // Models that don't have tenant_id
                        const globalModels = ['Tenant'];
                        if (tenantId && !globalModels.includes(model)) {
                            if (operation === 'create' || operation === 'createMany' || operation === 'update' || operation === 'updateMany') {
                                // Inject tenantId to data
                                if (args.data) {
                                    if (Array.isArray(args.data)) {
                                        args.data = args.data.map((d: any) => ({ ...d, tenant_id: tenantId }));
                                    } else {
                                        args.data = { ...args.data, tenant_id: tenantId } as any;
                                    }
                                }
                            }

                            if (operation === 'findUnique' || operation === 'findFirst' || operation === 'findMany' || operation === 'update' || operation === 'updateMany' || operation === 'delete' || operation === 'deleteMany' || operation === 'count') {
                                // Inject tenantId to where clause
                                args.where = { ...(args.where as any), tenant_id: tenantId };
                            }
                        }

                        return query(args);
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
