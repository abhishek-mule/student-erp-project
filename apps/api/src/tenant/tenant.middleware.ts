import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantAsyncStorage } from './tenant.context';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(private readonly prisma: PrismaService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const host = req.headers.host || '';
        const subdomain = host.split('.')[0];

        // Skip checking for super admin domains
        if (host.startsWith('admin.') || subdomain === 'www' || subdomain === 'platform' || subdomain === 'localhost') {
            return next();
        }

        try {
            // Find the tenant by slug based on subdomain
            // For this step we use the raw client before extensions if it avoids infinite loops, 
            // but since the extension uses ALS, and if ALS is not set it just skips, we can use the main client.
            const tenant = await this.prisma.originalClient.tenant.findUnique({
                where: { slug: subdomain },
            });

            if (!tenant) {
                return res.status(404).json({ message: 'Tenant not found' });
            }

            // Run the request in the context of this tenant
            tenantAsyncStorage.run({ tenantId: tenant.id }, () => {
                next();
            });
        } catch (err) {
            console.error('Tenant resolution error:', err);
            next(err);
        }
    }
}
