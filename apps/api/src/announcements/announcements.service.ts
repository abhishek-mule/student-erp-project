import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@college-erp/prisma';
import { EventsGateway } from '../events/events.gateway';
import { getTenantId } from '../tenant/tenant.context';

@Injectable()
export class AnnouncementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsGateway,
  ) {}

  async create(data: {
    title: string;
    content: string;
    audience: Role[];
    authorId: string;
  }) {
    const tenantId = getTenantId();
    if (!tenantId) throw new Error('Tenant context required');

    const announcement = await this.prisma.xclient.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        audience: data.audience,
        author_id: data.authorId,
      } as any,
    });

    // Notify all members of the tenant via fallback
    // Or we could logic it to specific rooms
    this.events.emitToTenant(tenantId, 'announcement.new', announcement);

    return announcement;
  }

  async getForUser(userId: string, role: Role) {
    return this.prisma.xclient.announcement.findMany({
      where: {
        audience: {
          has: role,
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }
}
