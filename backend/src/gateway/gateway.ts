import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { TableauService } from "../tableau/tableau.service";
@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000'],
        credentials: true,
    },
})
export class MyGateway implements OnModuleInit, OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket> {
    
    @WebSocketServer()
    server: Server;
    
    private gaB: number[][];
    private userArray: string[] = [];
    constructor(private readonly tableauService: TableauService) {}

    onModuleInit() {
        this.server.on('-- ON MODULE INIT -- connection : ', (socket) => {
            console.log('Connection -> ', socket.id);
        })
        this.tableauService.onGameBoardUpdated((newBoard) => {
            this.server.emit('gameBoardUpdate', newBoard);
          });      
    }

    private sendUAEvent() {
        this.server.emit('updateUA', { userArray: this.userArray });
    }

    @SubscribeMessage('UpdatePosition')
    handleUpdatePositionPaddle(client: Socket, data: { key: string }) {
        console.log("Le serveur apprend que le client a bougé son paddle");
        client.emit('PositionUpdatedInServer', { note: 'Server received updated position'});

    }
    
    @SubscribeMessage('keydown')
    handleKeyPressed(client: Socket, data: { key: string }) {
        console.log('PADDLE MOVED:', data, 'by', client.id);
        this.handleUpdatePositionPaddle(client, data);
        client.emit('keyPressedResponse', { message: 'Server received key press' });
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    























    getConnectedUsers(): string[] {
        return Array.from(this.userArray);
    }
    
    
    private displayUserArray(): void {
        console.log("-------------------------------");
        this.userArray.forEach((item, index) => {
            console.log(`item [${item}] | index ${index}`);
        })
        console.log("-------------------------------");
    }
    
    handleConnection(client: Socket, ...args: any[]) {
        console.log("Le client connecte est -> ", client.id);
        this.addUser(client.id);
        this.sendUAEvent();

        const userIndex = this.userArray.indexOf(client.id);
        this.server.to(client.id).emit('yourUserId', userIndex + 1);

        this.server.emit('user-connected', { clientId: client.id, userArray: this.userArray});
        this.displayUserArray();
    }
    
    handleDisconnect(client: Socket, ...args: any[]) {
        this.removeUser(client.id);
        this.server.emit('user-disconnected', { clientId: client.id, userArray: this.userArray});
        this.sendUAEvent();
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
    }
   
}