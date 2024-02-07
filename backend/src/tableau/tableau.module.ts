import { Module } from '@nestjs/common';
import { TableauController } from './tableau.controller';
import { TableauService } from './tableau.service';


@Module({
  controllers: [TableauController],
  providers: [TableauService],
  exports: [TableauService],
})
export class TableauModule {}
