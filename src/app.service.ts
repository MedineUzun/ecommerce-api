import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      status: 'success',
      message: 'Wibesoft E-Commerce API is running smoothly',
      timestamp: new Date().toISOString()
    };
  }
}
