import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, Min, IsUrl } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the product' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'The price of the product', minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'The image URL of the product' })
  @IsUrl()
  imageUrl: string;

  @ApiProperty({ description: 'The stock count', minimum: 0, default: 0, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({ description: 'Whether the product is active', default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
