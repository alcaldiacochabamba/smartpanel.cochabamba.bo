import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { PanelsService } from 'src/panels/panels.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
@WebSocketGateway({ cors: true })
export class PanelGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  private panelId: string;

  constructor(
    private readonly panelService: PanelsService
  ){}

  handleConnection(client: Socket) {
    const query = client.handshake.query;
    this.panelId = query.panel_id?.toString() || '';
    client.emit('connection', { message: 'Welcome to the WebSocket server!' });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @Cron('0 */15 * * * *') 
  private async sendClient() {
    try {
      if (this.panelId) {
        const panelData = await this.panelService.getPanelCompleteById(this.panelId);
        this.server.emit('message', { content: panelData });
      }
    } catch (error) {
      console.error('Error in scheduled task:', error.message);
    }
  }

}
