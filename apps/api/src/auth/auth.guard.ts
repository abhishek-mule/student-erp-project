import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@college-erp/prisma';
import { ROLES_KEY } from './roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { getTenantId } from '../tenant/tenant.context';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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
      throw new UnauthorizedException('Authentication token is missing');
    }

    try {
      const tenantId = getTenantId();

      if (!tenantId) {
        throw new UnauthorizedException('Tenant not identified');
      }

      const payload = await this.jwtService.verifyAsync(token);

      // Cross-tenant data leakage prevention check
      if (payload.tenant_id !== tenantId) {
        throw new UnauthorizedException(
          'Token is strictly invalid for this environment.',
        );
      }

      const user = await this.prisma.originalClient.user.findFirst({
        where: { id: payload.sub, tenant_id: tenantId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found in this tenant');
      }

      request['user'] = user;

      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }

      return requiredRoles.includes(user.role);
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException(
        'Invalid authentication or insufficient permissions',
      );
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
