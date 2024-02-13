import { useContext, useEffect, useState, useRef } from "react"
import React from 'react';
import { WebsocketContext } from "../../contexts/WebsocketContext"
import Paddle, { PaddleType } from '../../components/PGame/Paddle'
import axios from 'axios';
import { CreateContextOptions } from "vm";
import { BallType, GameStateFD } from "./GameStateFD";
import { SocketAddress } from "net";

// import { Ball, BallType } from '../../../../backend/src/Game/Ball'

// let boardWidth = 500;
// let boardHeight = 500;

// let playerWidth = 10;
// let playerHeight = 50;
// let playerVelocityY = 0;

// let ballWidth = 10;
// let ballHeight = 10;

// let player1Score = 0;
// let player2Score = 0;

export const WebsocketSG = () => {

    const [serverMessage, setServerMessage] = useState('');
    const [serverAMessage, setAServerMessage] = useState('');
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
    const socket = useContext(WebsocketContext);
    const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [gameState, setGameState2] = useState<GameStateFD>(new GameStateFD());

    const updateScorePlayer2 = (data: number) => {
        gameState.player2Score = data;
    }

    const updateScorePlayer1 = (data: number) => {
        gameState.player1Score = data;
    }
    
    const displayScore = (context: CanvasRenderingContext2D) => {
        context.font = "45px sans-serif";
        context.fillText(gameState.player1Score.toString(), gameState.boardWidth / 5, 45);
        context.fillText(gameState.player2Score.toString(), gameState.boardWidth * 4 / 5 - 45, 45);
    }
    
    const displayLine = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
    for (let i = 10; i < board.height; i += 25) {
            context.fillRect(board.width / 2 - 10, i, 5, 5);
        }
    }

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

    const renvoiBallData = (updateBallData: GameStateFD) => {
        const context = getCanvasTheContext();
        if (context) {
            console.log("dans le context");
            context.clearRect(0, 0, gameState.boardWidth, gameState.boardHeight);
            updateBallData.ball.x += updateBallData.ball.velocityX;
            updateBallData.ball.y += updateBallData.ball.velocityY;
        }
    }
    
    const drawBall = (context: CanvasRenderingContext2D) => {

        context.fillStyle = "pink";
        context.beginPath();
        context.arc(gameState.ball.x, gameState.ball.y, gameState.ball.width / 2, 0, 2 * Math.PI);
        context.fill();
    }

    const ballReceptionServer = (ball: number) => {
        gameState.ball.velocityX = ball;
    }//collisionBall detecting aingsnt machin evenement

    const ballCollisionBorder = (ball: number) => {
        gameState.ball.velocityY = ball;
    }//borderCollision detecting borderevenemt

    const initiateBall = (ballX: number, ballY: number) => {
        gameState.ball.x = ballX;
        gameState.ball.y = ballY;
    }

    const drawPaddle1 = (context: CanvasRenderingContext2D) => {
        context.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.paddle1.width, gameState.paddle1.height);
    }

    const drawPaddle2 = (context: CanvasRenderingContext2D) => {
        context.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.paddle2.width, gameState.paddle2.height);
    }

    const initiatePaddle1 = (data: number) => {
        gameState.paddle1.y = data;
    }

    const initiatePaddle2 = (data: number) => {
        gameState.paddle2.y = data;
    }

    const update = () => {
        const board = createBoardGame();
        if (board) {
            const context = createContextCanvas(board);
            if (context ) {
                context.fillStyle = "skyblue";
                drawPaddle1(context);
                drawPaddle2(context);
                drawBall(context);
                displayScore(context);
                displayLine(context, board);
            }
        }
        requestAnimationFrame(update);
    };

    const sendCanvasToServer = (ball: GameStateFD, context: CanvasRenderingContext2D) => {
        socket.emit('sendCanvasToServer', ball, context);
    }
    
    useEffect(() => {
        update();

        const handleConnect = () => {
            console.log('Connected in START GAME!');
            
        }
        socket.on('connect', handleConnect);
        if (socket.connected) {
            console.log(`je suis ${socket.id} dans game gate .tsx`);
        }

        socket.emit('handleInit1');
        socket.emit('handleInit2');
        socket.emit('handleInitBallAndGame');
        
        const userId = 1;
        const makeMovePaddle1 = (newVelocityY: number) => {
            console.log("velocity en recepton = ", newVelocityY);
        }
        const makeMovePaddle2 = (newVelocityY: number) => {
            console.log("velocity en recepton = ", newVelocityY);
        }
        
        const handleKeyDown = (event: KeyboardEvent) => {
            
            if (event.key === 'ArrowUp') {
                if (userId === 1) {
                    socket.emit('keyupPD1', { key: event.code })
                        socket.on('paddle1Moved', (newVelocityY) => {
                        makeMovePaddle1(newVelocityY);
                    })
                    console.log(`Arrow UP by ${userId}`);
                    
                } else if (userId === 2) {
                    socket.emit('keyupPD2', { key: event.code })
                    socket.on('paddle2Moved', (newVelocityY) => {
                        makeMovePaddle2(newVelocityY);
                    })
                    console.log(`Arrow UP by ${userId}`);
                }
            }
            else if (event.key === 'ArrowDown') {
                if (userId === 1) {
                    socket.emit('keydownPD1', { key: event.code })
                    socket.on('paddle1Moved', (newVelocityY) => {
                        makeMovePaddle1(newVelocityY);
                    })
                    console.log(`Arrow DOWN by ${userId}`);
                } else if (userId === 2) {
                    socket.emit('keydownPD2', { key: event.code })
                    socket.on('paddle2Moved', (newVelocityY) => {
                        makeMovePaddle2(newVelocityY);
                    })
                    console.log(`Arrow DOWN by ${userId}`);
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
            // setBall(updateBallData);
            renvoiBallData(updateBallData);
        })

        window.addEventListener('keydown', handleKeyDown);
        socket.on('keyPressedResponse', handleKeyPressedResponse);
        socket.on('PositionUpdatedInServer', handleUpdatedResponse);
        socket.on('sendCanvasToServer', sendCanvasToServer);

        //quand je reviens du serveur. le serveur renvoie :
        socket.on('initplayer1', (newGameState) => {
            initiatePaddle1(newGameState);
        })

        socket.on('initplayer2', (newGameState) => {
            initiatePaddle2(newGameState);
        })

        socket.on('updatePlayer2', (newGameState) => {
            updateScorePlayer2(newGameState);
        })

        socket.on('updatePlayer1', (newGameState) => {
            updateScorePlayer1(newGameState);
        })

        socket.on('initBall', (ball: number, bally: number) => {
            initiateBall(ball, bally);
        })

        socket.on('collisionBall', (ball: number) => {
            ballReceptionServer(ball);
        })//detecting B agaist

        socket.on('borderCollision', (ball: number) => {
            ballCollisionBorder(ball);
        })//detecting border

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
            socket.off('updateBallDataToClientTHREE');
            socket.off('initplayer1');
            socket.off('initplayer2');
            socket.off('updatePlayer2');
            socket.off('updatePlayer2');
        }
        
    }, [update]);
    
    return (
        <div className="game-container">
            <canvas id="board"></canvas>
        </div>
  );
}

export default WebsocketSG;