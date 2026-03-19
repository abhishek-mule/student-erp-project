import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { getTenantId } from '../tenant/tenant.context';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new UnauthorizedException('Tenant context not found');
    }

    const user = await this.prisma.originalClient.user.findFirst({
      where: { email, tenant_id: tenantId },
    });

    if (user && user.passwordHash) {
      const isMatch = await bcrypt.compare(pass, user.passwordHash);
      if (isMatch) {
        const { passwordHash, refreshTokenHash, ...result } = user as any;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    return this.generateTokens(user.id, user.email, user.tenant_id);
  }

  async generateTokens(userId: string, email: string, tenantId: string) {
    const payload = { sub: userId, email, tenant_id: tenantId };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    const salt = await bcrypt.genSalt(10);
    const refreshTokenHash = await bcrypt.hash(refreshToken, salt);

    await this.prisma.originalClient.user.update({
      where: { id: userId },
      data: { refreshTokenHash } as any,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshTokens(userId: string, tenantId: string, rt: string) {
    const user = (await this.prisma.originalClient.user.findUnique({
      where: { id: userId },
    })) as any;

    if (!user || user.tenant_id !== tenantId || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access Denied');
    }

    const rtMatches = await bcrypt.compare(rt, user.refreshTokenHash);
    if (!rtMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    return this.generateTokens(user.id, user.email, user.tenant_id);
  }
}
