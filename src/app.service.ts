/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(userId): string {
    return 'Hello World!';
  }
}
