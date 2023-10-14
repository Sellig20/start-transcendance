import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('status')
export class StatusController {
    @Get("/health")
    @ApiOperation({ summary: 'Give the status of the server'})
    @ApiResponse({ status: 200 , description: "Success"})
    health_check() {
        return "up and running";
    }
}
