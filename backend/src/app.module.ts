import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusController } from './status/status.controller';

@Module({
  imports: [],
  controllers: [AppController, StatusController],
  providers: [AppService],
})
export class AppModule {}
