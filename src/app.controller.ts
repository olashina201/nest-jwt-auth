import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUserById } from './utils/get-user-by-id.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getHello(@GetCurrentUserById() userId: number): string {
    console.log('getHello() controller', userId);
    return this.appService.getHello(userId);
  }
}
