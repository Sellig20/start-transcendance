import { useContext, useEffect, useState } from "react"
import React from 'react';
import { WebsocketContext } from "../../contexts/WebsocketContext"
import Paddle, { PaddleType } from '../../components/PGame/Paddle'
import axios from 'axios';

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
    const resetBall = (direction: number) => {
        ball.x = boardWidth / 2 - ball.width / 2; // Replace la balle au centre horizontalement
        ball.y = boardHeight / 2 - ball.height / 2;
        ball.width =   ballWidth;
        ball.height = ballHeight; // Replace la balle au centre verticalement
        ball.velocityX = direction;
        ball.velocityY = 2;
      };

    // const detect = (ball: Ball, paddle: Paddle): boolean => {
    //     return (
    //       ball.x < paddle.x + paddle.width &&
    //       ball.x + ball.width > paddle.x &&
    //       ball.y < paddle.y + paddle.height &&
    //       ball.y + ball.height > paddle.y
    //     );
    //   };
    // const initiateGame = () => {}

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

                let ballHitPaddle = false;
                
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

                if (ball.x < 0 && !ballHitPaddle) {
                    player2Score++;
                    resetBall(1);;
                }
                else if (ball.x + ballWidth > boardWidth && !ballHitPaddle) {
                    player1Score++;
                    resetBall(-1);
                }

                context.font = "45px sans-serif";
                context.fillText(player1Score.toString(), boardWidth / 5, 45);
                context.fillText(player2Score.toString(), boardWidth * 4 / 5 - 45, 45);

                for (let i = 10; i < board.height; i += 25) {
                    context.fillRect(board.width / 2 - 10, i, 5, 5);
                }
            }
            requestAnimationFrame(update);
        }
    };


    interface GameBoardType {
        // Définissez la structure de votre tableau ici
        // Par exemple, un tableau bidimensionnel de nombres
        [key: string]: number[];
      }
    const [gameBoard, setGameBoard] = useState<GameBoardType>({});







    useEffect(() => {

        update();

        const handleConnect = () => {
            console.log('Connected in START GAME!');

        }
        
        socket.on('connect', handleConnect);

        if (socket.connected) {
            console.log(`je suis ${socket.id} dans game gate .tsx`);
        }



        axios.get('http://localhost:3001/StartGame')
      .then(response => {
        const receivedGameBoard: GameBoardType = response.data.gameBoard;
        setGameBoard(receivedGameBoard);
      })
      .catch(error => {
        console.error('Error fetching game board:', error);
      });



























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
        // <div className="game-container">
        //     <canvas id="board"></canvas>
        // </div>
        <div className="game-container">
      {/* Utiliser gameBoard pour afficher le tableau dans votre composant */}
      {Object.keys(gameBoard).map((rowKey, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {gameBoard[rowKey].map((cell, colIndex) => (
            <div key={colIndex} className="board-cell">
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default WebsocketSG;