import { Controller, Get, Inject } from '@nestjs/common';
import { TableauService } from './tableau.service';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';

@Controller('tableau')
export class TableauController {
  @WebSocketServer() server: Server;
  constructor(@Inject(TableauService) private readonly tableauService: TableauService) {}

  @Get()
  getGameBoard(): number[][] {
    return this.tableauService.getGameBoard();
  }
  
}
