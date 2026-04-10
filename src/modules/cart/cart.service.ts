import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getCart(sessionId: string) {
    const cart = await this.cartModel.findOne({ sessionId }).populate('items.productId');
    if (!cart) {
      return { sessionId, items: [], total: 0 };
    }
    return this.calculateTotal(cart);
  }

  async addItem(sessionId: string, productId: string, quantity: number) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    let cart = await this.cartModel.findOne({ sessionId });
    
    if (!cart) {
      cart = new this.cartModel({
        sessionId,
        items: [{ productId, quantity, price: product.price }],
      });
    } else {
      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
      
      if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (product.stock < newQuantity) {
          throw new BadRequestException('Insufficient stock for the requested total quantity');
        }
        cart.items[itemIndex].quantity = newQuantity;
        cart.items[itemIndex].price = product.price; // Update snapshotted price
      } else {
        cart.items.push({
          productId: product.id,
          quantity,
          price: product.price,
        } as any);
      }
    }

    await cart.save();
    this.logger.log(`Item ${productId} added to cart for session: ${sessionId}`);
    return this.getCart(sessionId);
  }

  async updateItem(sessionId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const cart = await this.cartModel.findOne({ sessionId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    const product = await this.productModel.findById(productId);
    if (product && product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    return this.getCart(sessionId);
  }

  async removeItem(sessionId: string, productId: string) {
    const cart = await this.cartModel.findOne({ sessionId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();
    return this.getCart(sessionId);
  }

  async clearCart(sessionId: string) {
    await this.cartModel.findOneAndDelete({ sessionId });
    return { sessionId, items: [], total: 0 };
  }

  private calculateTotal(cart: any) {
    const total = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return { ...cart.toObject(), total };
  }
}
