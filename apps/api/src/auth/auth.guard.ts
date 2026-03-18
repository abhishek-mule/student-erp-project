import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@college-erp/prisma';
import { ROLES_KEY } from './roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { getTenantId } from '../tenant/tenant.context';
import { verifyToken } from '@clerk/clerk-sdk-node';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector, private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token is missing');
        }

        try {
            // Verify via Clerk
            const verifiedToken = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY,
                issuer: `https://${process.env.CLERK_ISSUER_DOMAIN || 'your-issuer.clerk.accounts.dev'}`,
            });

            const clerkUserId = verifiedToken.sub;
            const tenantId = getTenantId();

            if (!tenantId) {
                throw new UnauthorizedException('Tenant not identified');
            }

            // Fetch user from DB bypass extension using xclient where clauses mapped by ALS implicitly!
            // Since tenant ID is in ALS, the prisma.xclient automatically filters by it.
            // But since PrismaClient types might not perfectly match the extension when accessing via custom property, 
            // we can just use the database directly here without the extension if we pass the tenant_id explicitly.
            const user = await this.prisma.originalClient.user.findFirst({
                where: { id: clerkUserId, tenant_id: tenantId },
            });

            if (!user) {
                throw new UnauthorizedException('User not found in tenant');
            }

            request['user'] = user;

            const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);

            if (!requiredRoles) {
                return true;
            }

            return requiredRoles.includes(user.role);
        } catch (e) {
            console.error(e);
            throw new UnauthorizedException('Invalid token or insufficient permissions');
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
