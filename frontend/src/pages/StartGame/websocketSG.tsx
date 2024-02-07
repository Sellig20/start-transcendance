import { useContext, useEffect, useState } from "react"
import React from 'react';
import { WebsocketContext } from "../../contexts/WebsocketContext"
import Paddle, { PaddleType } from '../../components/PGame/Paddle'
import { all } from "axios";

type GameBoard = number[][];

let boardWidth = 500;
let boardHeight = 500;
let context; 

//players
let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 0;

let ballWidth = 10;
let ballHeight = 10;

export const WebsocketSG = () => {

    const [localGameBoard, setLocalGameBoard] = useState<GameBoard>([]);

    const [serverMessage, setServerMessage] = useState('');
    const [serverAMessage, setAServerMessage] = useState('');

    const socket = useContext(WebsocketContext);
    
    const [paddle1, setPaddle1] = useState<PaddleType>({
        x: 10,
        y: boardHeight / 2,
        width: playerWidth,
        height: playerHeight,
        velocityY: playerVelocityY,
    });
    
    const [paddle2, setPaddle2] = useState<PaddleType>({
        x: boardWidth - playerWidth - 10,
        y: boardHeight / 2,
        width: playerWidth,
        height: playerHeight,
        velocityY: playerVelocityY,
    });

    const [ball, setBall] = useState({
        x: boardHeight / 2,
        y: boardHeight / 2,
        width: ballWidth,
        height: ballHeight,
        velocityX: 1,
        velocityY: 2
    })

    function detect(a: any, b: any) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    const update = () => {
        const board = document.getElementById("board") as HTMLCanvasElement | null;
        
        const boardHeight = 500;
        const boardWidth = 500;
        if (board) {
            board.height = boardHeight;
            board.width = boardWidth;
            const context = board.getContext("2d");
            if (context ) {
                context.fillStyle = "skyblue";
                paddle1.y += paddle1.velocityY;
                paddle1.y = Math.max(0, Math.min(boardHeight - paddle1.height, paddle1.y));

                context.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
                paddle2.y += paddle2.velocityY;
                paddle2.y = Math.max(0, Math.min(boardHeight - paddle2.height, paddle2.y));

                context.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
                context.fillStyle = "yellow";
                ball.x += ball.velocityX;
                ball.y += ball.velocityY;
                context.fillRect(ball.x, ball.y, ball.width, ball.height);
                if (ball.y <= 0 || ball.y + ball.height >= boardHeight) {
                    ball.velocityY = -ball.velocityY;
                }
                
                if (detect(ball, paddle1)) {
                    if (ball.x <= paddle1.x + paddle1.width) {
                        ball.velocityX *= -1;
                    }
                }
                else if (detect(ball, paddle2)) {
                    if (ball.x + ballWidth >= paddle2.x) {
                        ball.velocityX *= -1;
                    }
                }
            }
            requestAnimationFrame(update);
        }
    };

    useEffect(() => {

        update();

        const handleConnect = () => {
            console.log('Connected in START GAME!');

        }
        
        socket.on('connect', handleConnect);

        if (socket.connected) {
            console.log(`je suis ${socket.id} dans game gate .tsx`);
        }































        const userId = 1;

        const setPaddle1Posi = (e : KeyboardEvent) => {
            console.log("Dans paddle posi");
            if (e.code == "ArrowUp") {
                console.log("dans le if");
                paddle1.velocityY = -3;
            }
            else if (e.code == "ArrowDown") {
                paddle1.velocityY = 3;
            }
        }
        
        const setPaddle2Posi = (e :KeyboardEvent) => {
            if (e.code == "ArrowUp") {
                paddle2.velocityY = -3;
            }
            else if (e.code == "ArrowDown") {
                paddle2.velocityY = 3;
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            
            const paddleSpeed: number = 1;
            if (event.key === 'ArrowUp') {
                if (userId === 1) {
                    setPaddle1Posi(event);
                    console.log(`Arrow UP by ${userId}`);
                    socket.emit('keydown', { direction: 'ArrowUp'});
                
                } else if (userId === 2) {
                    setPaddle2Posi(event);
                    console.log(`Arrow UP by ${userId}`);
                    socket.emit('keydown', { direction: 'Arrowup'});
                }
            }
            else if (event.key === 'ArrowDown') {
                if (userId === 1) {
                    setPaddle1Posi(event);
                    console.log(`Arrow DOWN by ${userId}`);
                    socket.emit('keydown', { direction: 'ArrowUp'});
                } else if (userId === 2) {
                    setPaddle2Posi(event);
                    console.log(`Arrow DOWN by ${userId}`);
                    socket.emit('keydown', { direction: 'Arrowdown'});
                }
            }
        }; 

        const handleUpdatedResponse = (data: any) => {
            console.log("Reponse du serveur :", data.note)
            setServerMessage(data.note);
        }

        const handleKeyPressedResponse = (data: any) => {
            console.log("Reponse du serveur keypressed : ", data.message);
            setAServerMessage(data.message);
        }

        window.addEventListener('keydown', handleKeyDown);
        socket.on('keyPressedResponse', handleKeyPressedResponse);
        socket.on('PositionUpdatedInServer', handleUpdatedResponse);

        return () => {
            console.log("Unregistering events...");  
            socket.off('connect');

            window.removeEventListener('keydown', handleKeyDown);
            socket.off('keyPressedResponse',handleKeyPressedResponse);
            socket.off('PositionUpdatedInServer', handleUpdatedResponse);
            socket.off('updatePaddle1');
            socket.off('updatePaddle2');
        }

    }, []);

    return (
        <div className="game-container">
            <canvas id="board"></canvas>
        </div>
    )
}

export default WebsocketSG;












{/* <div className="pong-game-container">
            <div className="paddle" style={{ top: `${paddle1Pos * 10}%`, left: 0 }}>
            Paddle 1
            </div>

            <div className="paddle" style={{ bottom: `${paddle2Pos * 10}%`, right: 0 }}>
            Paddle 2
            </div>

            {/* <div className="ball" style={{ top: `${ballY * 10}%`, left: `${ballX * 10}%` }}>
            Ball
            </div> */}

            // <div className="game-board-container">
            // {localGameBoard.map((row, rowIndex) => (
            //     <div key={rowIndex} className="row">
            //     {row.map((cell, colIndex) => (
            //         <div key={colIndex} className={`cell${cell === 1 ? ' player-paddle' : cell === 2 ? ' opponent-paddle' : cell === 3 ? ' ball' : ''}`}></div>
            //     ))}
            //     </div>
            // ))}
            // </div>
       // </div> */}