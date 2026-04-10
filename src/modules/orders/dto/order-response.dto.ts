import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OrderItemResponseDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  subtotal: number;
}

export class OrderResponseDto {
  @ApiProperty()
  _id: string;

  @ApiPropertyOptional()
  sessionId?: string;

  @ApiPropertyOptional()
  userId?: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
