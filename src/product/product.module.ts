import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from '../entity/product';
import { ProductCategory } from '../entity/product-category';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategory])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
