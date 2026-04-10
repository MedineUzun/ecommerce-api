import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/schemas/product.schema';

export class CartItemResponseDto {
  @ApiProperty({ type: () => Product })
  productId: Product;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;
}

export class CartResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  sessionId: string;

  @ApiProperty({ type: [CartItemResponseDto] })
  items: CartItemResponseDto[];

  @ApiProperty()
  total: number;
  
  @ApiProperty()
  createdAt: Date;
  
  @ApiProperty()
  updatedAt: Date;
}
