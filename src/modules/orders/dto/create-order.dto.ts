import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'Session ID for guest orders' })
  @IsNotEmpty()
  @IsString()
  sessionId: string;
}
