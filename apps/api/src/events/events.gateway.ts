import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('WebSocket Server Initialized with Redis Adapter');
  }

  handleConnection(client: Socket) {
    // Expected client to send their tenantId and roles through auth/handshake
    const tenantId =
      client.handshake.auth?.tenantId || client.handshake.query?.tenantId;
    const userId =
      client.handshake.auth?.userId || client.handshake.query?.userId;

    if (tenantId) {
      client.join(`tenant:${tenantId}`);
      if (userId) {
        client.join(`tenant:${tenantId}:user:${userId}`);
      }
    }
  }

  emitToTenant(tenantId: string, event: string, payload: any) {
    this.server.to(`tenant:${tenantId}`).emit(event, payload);
  }

  emitToCourse(
    tenantId: string,
    courseId: string,
    event: string,
    payload: any,
  ) {
    this.server
      .to(`tenant:${tenantId}:course:${courseId}`)
      .emit(event, payload);
  }

  emitToUser(tenantId: string, userId: string, event: string, payload: any) {
    this.server.to(`tenant:${tenantId}:user:${userId}`).emit(event, payload);
  }
}
