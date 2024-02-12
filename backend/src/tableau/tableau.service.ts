import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'stream';

@Injectable()
export class TableauService {
  private gameBoard: number[][];

  private eventEmitter: EventEmitter;

  constructor() {
    // Initialiser le tableau avec des valeurs par défaut
    // this.gameBoard = Array.from({ length: this.boardSizeX }, () => Array(this.boardSizeY).fill(0));
    this.eventEmitter = new EventEmitter();
  }

  getGameBoard(): number[][] {
    // console.log("Game Board dans la fonction getgameb :");
    // const x = 3;
    // const y = 4;
    // this.gameBoard[y][y] = 43;
    return this.gameBoard;
  }

  updateGameBoard(newBoard: number[][]): void {
    this.gameBoard = newBoard;
    this.eventEmitter.emit('gameBoardUpdated', newBoard);
  }

  onGameBoardUpdated(callback: (board: number[][]) => void): void {
    this.eventEmitter.on('gameBoardUpdated', callback);
  }
  
}

