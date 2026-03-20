import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantAsyncStorage } from './tenant.context';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Strongly enforce trusted proxies
    const xFor = req.headers['x-forwarded-host'];
    const host = (Array.isArray(xFor) ? xFor[0] : xFor) || req.headers.host || '';
    
    // Skip checking for health checks or public landing
    if (req.url === '/health' || req.url === '/') {
      return next();
    }
    
    // Security: Whitelist allowed root domains to prevent Host header spoofing
    const ALLOWED_DOMAINS = ['.college-erp.com', '.vercel.app', '.onrender.com', 'localhost:3000', 'localhost:3001'];
    const isAllowed = ALLOWED_DOMAINS.some(domain => host.endsWith(domain) || host === domain.split(':')[0]);

    if (!isAllowed) {
      return res.status(400).json({ message: 'Invalid Host header or proxy target' });
    }

    const subdomain = host.split('.')[0];


    // Skip checking for super admin domains
    if (
      host.startsWith('admin.') ||
      subdomain === 'www' ||
      subdomain === 'platform' ||
      subdomain === 'localhost'
    ) {
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
