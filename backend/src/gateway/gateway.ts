import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000'],
    },
})
export class MyGateway implements OnModuleInit, OnGatewayConnection<Socket> {

    @WebSocketServer()
    server: Server;

    private userArray: string[] = [];

    onModuleInit() {
        this.server.on('-- ON MODULE INIT -- connection', (socket) => {
            console.log(socket.id);
            console.log('-- ON MODULE INIT -- Connected in gateway.ts');
        })
    }
    
    handleConnection(client: Socket, ...args: any[]) {
        console.log(`-- connection ... -- Client connected: ${client.id}`);
        this.addUser(client.id);
    }

    private displayUserArray(): void {
        this.userArray.forEach((item, index) => {
            console.log(`-- user id : ${item} | user index : ${index}`);
        })
    }
    
    private addUser(item: string): void {
        this.userArray.push(item);
        const index = this.userArray.indexOf(item);
        console.log(`!! ADD USER -- USER ID : ${item} !!`);
        this.displayUserArray();
    }

    
    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        console.log(body);
        this.server.emit('onMessage', {
            msg: 'New Message',
            content: body,
        });
    }

    private removeUser(userId: string): void {
        const indexToRemove = this.userArray.indexOf(userId);
        if (indexToRemove !== -1) {
            this.userArray.splice(indexToRemove, 1);
            console.log(`XXXXXXXXXXXX ---------- REMOVE USER --------- USER ID : ${userId} XXXXXXXX`);
            this.displayUserArray();
        }
    }
    
    handleDisconnect(client: Socket) {
        // Gérer la déconnexion ici
        console.log(`Client déconnecté: ${client.id}`);
        this.removeUser(client.id);
    }
    
    // @SubscribeMessage('movePaddle')
    // handleMovePaddle(@MessageBody() data: { direction: string }, @ConnectedSocket() client: Socket) {
        //     this.server.emit('paddleMoved', data);
        // }
        
        @SubscribeMessage('keydown')
        handleKeyPressed(client: Socket, data: { key: string }) {
            console.log('PADDLE MOVED:', data, 'by', client.id);
            client.emit('keyPressedResponse', { message: 'Server received key press' });
        }
    }