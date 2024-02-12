import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { TableauService } from "../tableau/tableau.service";
import { GameState } from "../Game/GameState";
import { Ball, BallTypeBD } from "../Game/Ball";
import { SocketConnectOpts } from "net";
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
    private gameState: GameState = new GameState();
    private ballData: BallTypeBD = {
        x: 100,
        y: 150,
        width: 20,
        height: 20,
        velocityX: 3,
        velocityY: 2,
        color: "pink",
    };
    
    private ballServer: Ball = new Ball(this.ballData);
    
    private ballDataFromServer: BallTypeBD = this.ballServer.toBallType();
    

    constructor() {}

    onModuleInit() {
        this.server.on('-- ON MODULE INIT -- connection : ', (socket) => {
            console.log('Connection -> ', socket.id);
        })
    }

    private sendUAEvent() {
        this.server.emit('updateUA', { userArray: this.userArray });
    }

    
    private updateCanvas(gameState) {
        // gameState.ball.color = "red";
        // console.log("je suis dans ***********");
    }
    
    @SubscribeMessage('keydown')
    handleKeyPressedDown(client: Socket, data: { key: string }) {
        console.log('PADDLE MOVED:', data, 'by', client.id);
        // this.handleUpdatePositionPaddle(client, data);
        client.emit('keyPressedResponse', { message: 'Server received key press DOWNNNNNNN' });
    }

    @SubscribeMessage('keyup')
    handleKeyPressedUp(client: Socket, data: { key: string }) {
        console.log('PADDLE MOVED:', data, 'by', client.id);
        // this.handleUpdatePositionPaddle(client, data);
        client.emit('keyPressedResponse', { message: 'Server received key press UPPPPPPP' });
    }

    ReceiveCanvaInServer(client: Socket, ballData: string, payload: { imageData: string }): void {
        const receivedBallData: BallTypeBD = JSON.parse(ballData) as BallTypeBD;
        receivedBallData.color = "red";
        console.log("=>", receivedBallData);

        console.log("=>", this.ballData);
        const updateData = this.updateCanvas(this.gameState);

        const updatedballJSON = JSON.stringify(receivedBallData);
        this.server.emit('updateCanvasAfterSend', updatedballJSON);
    }

    @SubscribeMessage('sendBallDataToServer')
    handleBallDataFromFrontend(client: Socket, ballJSON: string): void {
        const processedBallData: BallTypeBD = JSON.parse(ballJSON);
        processedBallData.x = 250;
        processedBallData.y = 250;
        processedBallData.width = 10;
        processedBallData.height = 10;
        processedBallData.velocityX = 1;
        processedBallData.velocityY= 2;
        processedBallData.color = "red";
        client.emit('updateBallDataToClientTHREE', processedBallData);
    }

    handleCollisionWithLeftBorder() {
        // GameState.player2score += 1;
        this.server.emit('updateGameState2', this.gameState);
    }

    
    
    // @SubscribeMessage('balll')
    // sendBallDataToClient(client: Socket, ballData: BallTypeBD) {
    //     console.log("okokokokokkok");
    //     this.server.emit('ballDatax', ballJSON);
    // }
    
    


    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    























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