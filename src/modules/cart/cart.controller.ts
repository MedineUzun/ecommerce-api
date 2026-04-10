import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':sessionId')
  @ApiOperation({ summary: 'Get cart by session ID' })
  @ApiResponse({ status: 200, type: CartResponseDto })
  async getCart(@Param('sessionId') sessionId: string) {
    return this.cartService.getCart(sessionId);
  }

  @Post(':sessionId/items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, type: CartResponseDto })
  async addItem(
    @Param('sessionId') sessionId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addItem(sessionId, addToCartDto.productId, addToCartDto.quantity);
  }

  @Patch(':sessionId/items/:productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, type: CartResponseDto })
  async updateItem(
    @Param('sessionId') sessionId: string,
    @Param('productId') productId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(sessionId, productId, updateCartItemDto.quantity);
  }

  @Delete(':sessionId/items/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, type: CartResponseDto })
  async removeItem(
    @Param('sessionId') sessionId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(sessionId, productId);
  }

  @Delete(':sessionId')
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared' })
  async clearCart(@Param('sessionId') sessionId: string) {
    return this.cartService.clearCart(sessionId);
  }
}
