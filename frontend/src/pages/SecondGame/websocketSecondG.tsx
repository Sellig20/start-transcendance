import { useContext, useEffect, useState, useRef } from "react"
import React from 'react';
import { WebsocketContext } from "../../contexts/WebsocketContext"
import { GameStateFD } from "./GameStateFD";

export const WebsocketSecondG = () => {

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
    
    const setWinner = (winnerIs: boolean, winnerIdentity: string) => {
        if (winnerIs === true && winnerIdentity === "one") {
            gameState.player1Winner = true;
        }
        else if (winnerIs === true && winnerIdentity === "two") {
            gameState.player2Winner = true;
        }
    }

    const createBoardGame = () => {
        const board2 = document.getElementById("board2") as HTMLCanvasElement | null;
        const boardHeight = 500;
        const boardWidth = 500;
        if (board2) {
            board2.height = boardHeight;
            board2.width = boardWidth;
            return board2;
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
            context.clearRect(0, 0, gameState.boardWidth, gameState.boardHeight);
            updateBallData.ball.x += updateBallData.ball.velocityX;
            updateBallData.ball.y += updateBallData.ball.velocityY;
        }
    }
    
    const drawBall = (context: CanvasRenderingContext2D) => {
        context.fillStyle = "blue";
        context.beginPath();
        // context.arc(gameState.ball.x, gameState.ball.y, gameState.ball.width / 2, 0, 2 * Math.PI);
        context.fillRect(gameState.ball.x, gameState.ball.y, gameState.ball.width, gameState.ball.height);
        context.fill();
    }
    
    const drawPaddle1 = (context: CanvasRenderingContext2D) => {
        context.fillStyle = "red";

        context.beginPath();
        context.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.paddle1.width, gameState.paddle1.height);
        context.fill();
    }

    const drawPaddle2 = (context: CanvasRenderingContext2D) => {
        context.fillStyle = "red";

        context.beginPath();
        context.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.paddle2.width, gameState.paddle2.height);
        context.fill();
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

    const displayEndGame = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
        context.fillStyle = 'white';
        context.font = '40px Arial';
        context.textAlign = 'center';
        context.fillText('END GAME', board.width / 2, board.height / 2);
    }
    
    const ballReceptionServer = (ball: number) => {
        gameState.ball.velocityX = ball;
    }//collisionBall detecting aingsnt evenement

    const ballCollisionBorder = (ball: number) => {
        gameState.ball.velocityY = ball;
    }//borderCollision detecting border evenemt
    
    const initiateBall = (ballX: number, ballY: number) => {
        gameState.ball.x = ballX;
        gameState.ball.y = ballY;
    }
    
    const initiatePaddle1 = (data: number) => {
        gameState.paddle1.y = data;
    }

    const initiatePaddle2 = (data: number) => {
        gameState.paddle2.y = data;
    }

    const updateLevel = (updatedLevel: number) => {
        gameState.currentLevel = updatedLevel;
    }

    let time = 0;
    const update = () => {
        const board2 = createBoardGame();
        if (board2) {
            const context = createContextCanvas(board2);
            if (context) {
                if (gameState.player1Winner == true || gameState.player2Winner == true) {
                    console.log("FIN DE JEU");
                    displayEndGame(context, board2);
                    return ;
                }
                const waveColors = ['#ff6347', '#6495ed', '#00ced1', '#ff69b4', '#32cd32'];
                context.fillStyle = "skyblue";
                drawWaves(time, context, waveColors);
                drawPaddle1(context);
                drawPaddle2(context);
                drawBall(context);
                displayScore(context);
                displayLine(context, board2);
                time += 0.5;
                // context.clearRect(0, 0, gameState.boardWidth, gameState.boardHeight);
            }
        }
        requestAnimationFrame(update);
    };

    const drawWaves = (time: number, context: CanvasRenderingContext2D, waveColors: string[]) => {

      for (let i = 0; i < waveColors.length; i++) {
        const offset = i * 20;
        context.fillStyle = waveColors[i];
        context.beginPath();

        for (let x = 0; x < gameState.boardWidth; x += 10) {
          const y = Math.sin((x + time + offset) * 0.01) * 50 + gameState.boardHeight / 2;
          context.lineTo(x, y);
        }
        
        context.lineTo(gameState.boardWidth, gameState.boardHeight);
        context.lineTo(0, gameState.boardHeight);
        context.closePath();
        context.fill();
      }
    };

    const gameLoop = () => {
        
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

        socket.on('winnerIs', (winnerIs: boolean, winnerIdentity: string) => {
            setWinner(winnerIs, winnerIdentity);
        })

        socket.on('updateLevel', (updatedLevel: number) => {
            updateLevel(updatedLevel);
        })

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
            socket.off('initplayer1');
            socket.off('initplayer2');
            socket.off('updatePlayer2');
            socket.off('updatePlayer2');
        }
        
    }, [update]);
    
    return (
        // <div className="game-container2">
        //     <canvas id="board2"></canvas>
        // </div>
        <div>
        <canvas id="board2" style={{ 
          display: 'block', 
          margin: 0, 
          overflow: 'hidden' }} />;
        </div>);
}

export default WebsocketSecondG;