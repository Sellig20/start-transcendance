import { useContext, useEffect, useState, useRef } from "react"
import React from 'react';
import { WebsocketContext } from "../../contexts/WebsocketContext"
import Paddle, { PaddleType } from '../../components/PGame/Paddle'
import axios from 'axios';
import { BallTypeFD } from "../../components/BallStructureFD/BallStructure";
import { CreateContextOptions } from "vm";
// import { Ball, BallType } from '../../../../backend/src/Game/Ball'

type GameBoard = number[][];

let boardWidth = 500;
let boardHeight = 500;

let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 0;

let ballWidth = 10;
let ballHeight = 10;

let player1Score = 0;
let player2Score = 0;

export const WebsocketSG = () => {

    const [serverMessage, setServerMessage] = useState('');
    const [serverAMessage, setAServerMessage] = useState('');
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
    const socket = useContext(WebsocketContext);
    const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
    
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

    const [ball, setBall] = useState<BallTypeFD>({
        x: boardHeight / 2,
        y: boardHeight / 2,
        width: ballWidth,
        height: ballHeight,
        velocityX: 1,
        velocityY: 2,
        color: "violet"
    })












    function detect(a: any, b: any) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    const resetBall = (direction: number) => {
        ball.x = boardWidth / 2 - ball.width / 2; // Replace la balle au centre horizontalement
        ball.y = boardHeight / 2 - ball.height / 2;
        ball.width =   ballWidth;
        ball.height = ballHeight; // Replace la balle au centre verticalement
        ball.velocityX = direction;
        ball.velocityY = 2;
        ball.color = "grey"
      };

    // const detect = (ball: Ball, paddle: Paddle): boolean => {
    //     return (
    //       ball.x < paddle.x + paddle.width &&
    //       ball.x + ball.width > paddle.x &&
    //       ball.y < paddle.y + paddle.height &&
    //       ball.y + ball.height > paddle.y
    //     );
    //   };

    const detectigBall = (ballHitPaddle: boolean) => {
        if (detect(ball, paddle1)) {
            if (ball.x <= paddle1.x + paddle1.width) {
                ball.velocityX *= -1;
                ballHitPaddle = true;
            }
        }
        else if (detect(ball, paddle2)) {
            if (ball.x + ballWidth >= paddle2.x) {
                ball.velocityX *= -1;
                ballHitPaddle = true;
            }
        }
    }

    const resetingBall = (direction: 1, ballHitPaddle: boolean) => {
        if (ball.x < 0 && !ballHitPaddle) {
            player2Score++;
            resetBall(1);;
        }
        else if (ball.x + ballWidth > boardWidth && !ballHitPaddle) {
            player1Score++;
            resetBall(-1);
        }
    }
    
    const conditionHitBorder = () => {
        if (ball.y <= 0 || ball.y + ball.height >= boardHeight) {
            ball.velocityY = -ball.velocityY;
        }
    }

    const displayScore = (context: CanvasRenderingContext2D) => {
        context.font = "45px sans-serif";
        context.fillText(player1Score.toString(), boardWidth / 5, 45);
        context.fillText(player2Score.toString(), boardWidth * 4 / 5 - 45, 45);
    }
    
    const displayLine = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
    for (let i = 10; i < board.height; i += 25) {
            context.fillRect(board.width / 2 - 10, i, 5, 5);
        }
    }
    // const context = useRef<CanvasRenderingContext2D | undefined>(undefined);

    const createBoardGame = () => {
        const board = document.getElementById("board") as HTMLCanvasElement | null;
        const boardHeight = 500;
        const boardWidth = 500;
        if (board) {
            board.height = boardHeight;
            board.width = boardWidth;
            return board;
        }
    }
    
    const createContextCanvas = (board: HTMLCanvasElement) => {
        const context = board.getContext('2d');
        if (context) {
            canvasContextRef.current = context
            return context;
        }
        return null;
    }

    const getCanvasTheContext = () => {
        return canvasContextRef.current;
    }

    const renvoiBallData = (updateBallData: BallTypeFD) => {
        const context = getCanvasTheContext();
        if (context) {
            console.log("dans le context");
            context.clearRect(0, 0, boardWidth, boardHeight);
            updateBallData.x += updateBallData.velocityX;
            updateBallData.y += updateBallData.velocityY;
            // context.fillRect(updateBallData.x, updateBallData.y, updateBallData.width, updateBallData.height)
            // context.fill();
        }
    }
    
    const initiateBall = (ball: BallTypeFD, context: CanvasRenderingContext2D) => {
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;
        context.fillStyle = "pink";
        context.beginPath();
        context.arc(ball.x, ball.y, ball.width / 2, 0, 2 * Math.PI);
        context.fill();
        const ballJSON = JSON.stringify(ball);
        // socket.emit('sendBallDataToServer', ballJSON);
    }

    const initiatePaddle1 = (context: CanvasRenderingContext2D) => {
        paddle1.y += paddle1.velocityY;
        paddle1.y = Math.max(0, Math.min(boardHeight - paddle1.height, paddle1.y));
        context.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    }
    
    const initiatePaddle2 = (context: CanvasRenderingContext2D) => {
        paddle2.y += paddle2.velocityY;
        paddle2.y = Math.max(0, Math.min(boardHeight - paddle2.height, paddle2.y));
        context.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    }

    const update = () => {
        const board = createBoardGame();
        if (board) {
            const context = createContextCanvas(board);
            if (context ) {
                context.fillStyle = "skyblue";
                initiateBall(ball, context);
                initiatePaddle1(context);
                initiatePaddle2(context);
                conditionHitBorder();
                let ballHitPaddle = false;
                detectigBall(ballHitPaddle);
                resetingBall(1, ballHitPaddle);
                displayScore(context);
                displayLine(context, board);
            }
        }
        requestAnimationFrame(update);
    };

    const sendCanvasToServer = (ball: BallTypeFD, context: CanvasRenderingContext2D) => {
        socket.emit('sendCanvasToServer', ball, context);
    }
    
    useEffect(() => {
        
        update();
        // requestAnimationFrame(update);
        // const animate = () => {
        //     update();
        //     requestAnimationFrame(animate);

        // };
    
        // animate();

        const handleConnect = () => {
            console.log('Connected in START GAME!');
        }
        socket.on('connect', handleConnect);
        
        if (socket.connected) {
            console.log(`je suis ${socket.id} dans game gate .tsx`);
        }
        const userId = 1;
        
        const setPaddle1Posi = (e : KeyboardEvent) => {
            if (e.code == "ArrowUp") {
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
            
            if (event.key === 'ArrowUp') {
                if (userId === 1) {
                    setPaddle1Posi(event);
                    console.log(`Arrow UP by ${userId}`);
                    socket.emit('keyup', { direction: 'ArrowUp'});
                    
                } else if (userId === 2) {
                    setPaddle2Posi(event);
                    console.log(`Arrow UP by ${userId}`);
                    socket.emit('keyup', { direction: 'Arrowup'});
                }
            }
            else if (event.key === 'ArrowDown') {
                if (userId === 1) {
                    setPaddle1Posi(event);
                    console.log(`Arrow DOWN by ${userId}`);
                    socket.emit('keydown', { direction: 'Arrowdown'});
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
                
        socket.on('updateBallDataToClientTHREE', (updateBallData) => {
            setBall(updateBallData);
            renvoiBallData(updateBallData);
        })

        window.addEventListener('keydown', handleKeyDown);
        socket.on('keyPressedResponse', handleKeyPressedResponse);
        socket.on('PositionUpdatedInServer', handleUpdatedResponse);
        socket.on('sendCanvasToServer', sendCanvasToServer);

        // socket.on('clavierTouche', (newGameState) => {
        //     setGameState2(newGameState);
        // })

        return () => {
            console.log("Unregistering events...");  
            socket.off('connect');
            window.removeEventListener('keydown', handleKeyDown);
            socket.off('keyPressedResponse',handleKeyPressedResponse);
            socket.off('PositionUpdatedInServer', handleUpdatedResponse);
            socket.off('updatePaddle1');
            socket.off('updatePaddle2');
            socket.off('sendCanvasToServer', sendCanvasToServer);
            socket.off('updateCanvasAfterSend');
            socket.off('updateBallDataToClientTHREE')
        }
        
    }, []);
    
    return (
        <div className="game-container">
            <canvas id="board"></canvas>
        </div>
  );
}

export default WebsocketSG;