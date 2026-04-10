import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async createFromCart(sessionId: string) {
    const session = await this.connection.startSession();
    session.startTransaction();
    
    try {
      const cart = await this.cartModel.findOne({ sessionId }).populate('items.productId').session(session);
      
      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty or not found');
      }

      let totalAmount = 0;
      const orderItems: any[] = [];

      for (const item of cart.items) {
        const product = item.productId as any; 
        
        if (!product) {
            throw new BadRequestException(`Product in cart no longer exists`);
        }

        const currentProduct = await this.productModel.findById(product._id).session(session);
        
        if (!currentProduct) {
          throw new BadRequestException(`Product ${product.name || 'unknown'} not found`);
        }

        if (currentProduct.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${currentProduct.name}`);
        }

        currentProduct.stock -= item.quantity;
        await currentProduct.save({ session });

        const subtotal = item.quantity * currentProduct.price;
        totalAmount += subtotal;

        orderItems.push({
          productId: currentProduct._id,
          productName: currentProduct.name,
          quantity: item.quantity,
          unitPrice: currentProduct.price,
          subtotal,
        });
      }

      const order = new this.orderModel({
        sessionId,
        items: orderItems,
        totalAmount,
        status: 'pending',
      });

      const savedOrder = await order.save({ session });
      
      await this.cartModel.findOneAndDelete({ sessionId }).session(session);

      await session.commitTransaction();
      this.logger.log(`Order created successfully for session: ${sessionId}`);
      return savedOrder;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`Failed to create order for session: ${sessionId}`, error instanceof Error ? error.stack : '');
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
          throw error;
      }
      throw new InternalServerErrorException('Failed to create order');
    } finally {
      session.endSession();
    }
  }

  async findAll() {
    return this.orderModel.find().exec();
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
}
