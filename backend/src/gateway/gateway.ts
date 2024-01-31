// import { OnModuleInit } from "@nestjs/common";
// import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({
//     cors: {
//         origin: ['http://localhost:3000'],
//         credentials: true,
//     },
// })
// export class MyGateway implements OnModuleInit, OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket> {

//     @WebSocketServer()
//     server: Server;

//     private userArray: string[] = [];
    
//     onModuleInit(): void {
//         this.server.on('-- ON MODULE INIT -- connection', (socket) => {
//             console.log(socket.id);
//         })
//     }
    
//     handleConnection(client: Socket, ...args: any[]) {
//         this.addUser(client.id);
//         this.server.emit('user-connected', { clientId: client.id, userArray: this.userArray});
//     }
    
//     handleDisconnect(client: Socket, ...args: any[]) {
//         this.removeUser(client.id);
//         this.server.emit('user-disconnected', { clientId: client.id, userArray: this.userArray});
//     }

//     private displayUserArray(): void {
//         this.userArray.forEach((item, index) => {
//             console.log(`User : ${item} | index : ${index}`)
//         })
//     }
    
//     private addUser(item: string): void {
//         this.userArray.push(item);
//         this.displayUserArray();
//     }

//     private removeUser(userId: string): void {
//         const indexToRemove = this.userArray.indexOf(userId);
//         if (indexToRemove !== -1) {
//             this.userArray.splice(indexToRemove, 1);
//             this.displayUserArray();
//         }
//     }
    
//     @SubscribeMessage('newMessage')
//     onNewMessage(@MessageBody() body: any) {
//         console.log(body);
//         this.server.emit('onMessage', {
//             msg: 'New Message',
//             content: body,
//         });
//     }

//     @SubscribeMessage('keydown')
//     handleKeyPressed(client: Socket, data: { key: string }) {
//         console.log('PADDLE MOVED:', data, 'by', client.id);
//         client.emit('keyPressedResponse', { message: 'Server received key press' });
//     }
// }


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

    onModuleInit() {
        this.server.on('-- ON MODULE INIT -- connection : ', (socket) => {
            console.log('Connection -> ', socket.id);
        })
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log("Le client connecte est -> ", client.id);
        this.addUser(client.id);
        this.sendUAEvent();
        this.server.emit('user-connected', { clientId: client.id, userArray: this.userArray});
        this.displayUserArray();
    }
    
    handleDisconnect(client: Socket, ...args: any[]) {
        this.removeUser(client.id);
        this.server.emit('user-disconnected', { clientId: client.id, userArray: this.userArray});
        this.sendUAEvent();
    }

    private sendUAEvent() {
        this.server.emit('updateUA', { userArray: this.userArray });
    }

    private displayUserArray(): void {
        console.log("-------------------------------");
        this.userArray.forEach((item, index) => {
            console.log(`item [${item}] | index ${index}`);
        })
        console.log("-------------------------------");
    }

    private addUser(item: string): void {
        this.userArray.push(item);
        const index = this.userArray.indexOf(item);
        console.log(`Le client ajoute est => ${item} pour index : ${index}`);
    }

    private removeUser(userId: string): void {
        const indexToRemove = this.userArray.indexOf(userId);
        if (indexToRemove !== -1) {
            this.userArray.splice(indexToRemove, 1);
        }
        console.log(`Le client supprime est => ${userId} pour index : ${indexToRemove}`);
    }

    getConnectedUsers(): string[] {
        return Array.from(this.userArray);
    }
           
    @SubscribeMessage('keydown')
    handleKeyPressed(client: Socket, data: { key: string }) {
        console.log('PADDLE MOVED:', data, 'by', client.id);
        client.emit('keyPressedResponse', { message: 'Server received key press' });
    }
}