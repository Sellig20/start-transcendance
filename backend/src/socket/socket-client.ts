import { Injectable, OnModuleInit } from "@nestjs/common";
import { io, Socket } from "socket.io-client";

@Injectable()
export class SocketClient implements OnModuleInit {

    public socketClient: Socket;

    constructor() {
        this.socketClient = io('http:localhost:3000');

    }

    onModuleInit() {
        this.socketClient.on('connect', () => {
        console.log('Connected to Gateway');
        });
    }

}