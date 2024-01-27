import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000'],
        credentials: true,
    },
})
export class MyGateway implements OnModuleInit, OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket> {

    @WebSocketServer()
    server: Server;

    private userArray: string[] = [];
    private conUserByPage: Record<string, string[]> = {};

    onModuleInit() {
        this.server.on('-- ON MODULE INIT -- connection', (socket) => {
            console.log(socket.id);
            // console.log('-- ON MODULE INIT -- Connected in gateway.ts');
        })
    }

    
    handleConnection(client: Socket, ...args: any[]) {
        // console.log(`-- connection ... -- Client connected: ${client.id}`);
        this.server.emit('user-connected', { clientId: client.id, userArray: this.userArray});
        
        const pageId = args[0];
        if (!this.conUserByPage[pageId]) {
            this.conUserByPage[pageId] = [];
        }
        this.addUser(client.id, pageId);
        this.server.to(pageId).emit('user-connected', { clientId: client.id, userArray: this.conUserByPage[pageId] });
    }
    
    handleDisconnect(client: Socket, ...args: any[]) {
        // Gérer la déconnexion ici
        console.log(`Client déconnecté: ${client.id}`);

        const pageId = args[0];
        if (!this.conUserByPage[pageId]) {
            this.conUserByPage[pageId] = [];
        }
        this.removeUser(client.id, pageId);
        this.server.emit('user-disconnected', { clientId: client.id, userArray: this.userArray});
    }

    private displayUserArray(): void {
        this.userArray.forEach((item, index) => {
            console.log(`-- user id : ${item} | user index : ${index}`);
        })
    }
    
    private addUser(item: string, pageId: string): void {
        this.userArray.push(item);
        const index = this.userArray.indexOf(item);
        this.conUserByPage[pageId].push(item);
        console.log(`!! ADD USER -- USER ID : ${item} !!`);
        this.displayUserArray();
    }

    private removeUser(userId: string, pageId: string): void {
        const indexToRemove = this.userArray.indexOf(userId);
        if (indexToRemove !== -1) {
            this.userArray.splice(indexToRemove, 1);
            this.conUserByPage[pageId].splice(indexToRemove, 1);
            console.log(`XXXXXXXXXXXX ---------- REMOVE USER --------- USER ID : ${userId} XXXXXXXX`);
            console.log("----------------------- Tab apres deconnection : ");
            this.displayUserArray();
            console.log("-----------------------");
        }
    }
    
    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        console.log(body);
        this.server.emit('onMessage', {
            msg: 'New Message',
            content: body,
        });
    }

    @SubscribeMessage('checkPage')
    handleCheckPage(client: Socket, { pageId }: { pageId: string }) {
        const usersOnPage = this.conUserByPage[pageId] || [];
        client.emit('pageStatus', { usersOnPage });
    }
    
    getConnectedUsers(): string[] {
        return Array.from(this.userArray);
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