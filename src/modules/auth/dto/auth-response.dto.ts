import { ApiProperty } from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT Access Token' })
  accessToken: string;

  @ApiProperty({ description: 'User data (without password)' })
  user: Partial<User>;
}
