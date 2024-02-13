import { Module } from '@nestjs/common';
import { gatewayModule } from './gateway/gateway.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { TableauModule } from './tableau/tableau.module';

@Module({
  imports: [gatewayModule, TableauModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
