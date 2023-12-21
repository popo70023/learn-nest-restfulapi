import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { AuthGuard } from '../auth/auth.guard';
import { Product } from '../entity/product';
import { ProductDto } from './product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() productDto: ProductDto): Promise<Product> {
    const productExists = await this.productService.findByTitle(
      productDto.title,
    );
    console.log(productExists);
    if (productExists) throw new BadRequestException('Product already exists');
    const newProduct = await this.productService.create(productDto);

    console.log('新增成功', newProduct);
    return newProduct;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!this.productService.findById(parseInt(id)))
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

    const result = await this.productService.deleteById(parseInt(id));
    console.log(result, id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<Product[]> {
    const products = await this.productService.findAll();

    console.log('讀取成功');
    return products;
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    const product = await this.productService.findById(parseInt(id));
    if (!product) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

    console.log('讀取成功', id);
    return product;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() product: Product) {
    if (!this.productService.findById(parseInt(id)))
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    if (
      parseInt(id) != product.productId ||
      product.price === undefined ||
      product.stock === undefined ||
      product.title === undefined ||
      product.categories === undefined
    )
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);

    const result = await this.productService.update(product);
    console.log(result, id, product);
  }
}
