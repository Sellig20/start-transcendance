import { Module } from '@nestjs/common'
import { TableauModule } from '../tableau/tableau.module';
import { MyGateway } from './gateway';

@Module({
    imports: [TableauModule],
    providers: [MyGateway],
})
 
export class gatewayModule{}


















// import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({ namespace: 'ponggame' })
// export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   handleConnection(client: Socket, ...args: any[]) {
//     console.log(`Client connected: ${client.id}`);
//   }

//   handleDisconnect(client: Socket) {
//     console.log(`Client disconnected: ${client.id}`);
//   }

//   @SubscribeMessage('message')
//   handleMessage(client: Socket, payload: any): void {
//     console.log(`Message from client ${client.id}:`, payload);
//     this.server.to(client.id).emit('message', `Message received from client ${client.id}: ${payload}`);
//   }
// }