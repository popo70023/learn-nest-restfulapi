import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { Product } from '../entity/product';
import { ProductDto } from './product.dto';
import { ProductCategory } from '../entity/product-category';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
  ) {}

  async create(productDto: ProductDto): Promise<Product> {
    const { categoryNames, ...productData } = productDto;
    const createdProduct = await this.productRepository.create(productData);

    createdProduct.categories =
      await this.findAndCreateCategoryByCategoryNames(categoryNames);

    return this.productRepository.save(createdProduct);
  }

  async createCategory(categoryName: string): Promise<ProductCategory> {
    const createdCategory = this.categoryRepository.create({ categoryName });
    return this.categoryRepository.save(createdCategory);
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return this.productRepository.delete(id);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['categories'] });
  }

  async findByCategory(Category: ProductCategory): Promise<Product[]> {
    return this.productRepository.find({ where: { categories: Category } });
  }

  async findById(productId: number): Promise<Product | undefined> {
    return this.productRepository.findOne({
      where: { productId },
      relations: ['categories'],
    });
  }

  async findByTitle(title: string): Promise<Product | undefined> {
    return this.productRepository.findOne({
      where: { title },
      relations: ['categories'],
    });
  }

  async findCategoryByCategoryName(
    categoryName: string,
  ): Promise<ProductCategory | undefined> {
    return this.categoryRepository.findOne({ where: { categoryName } });
  }

  async findProductsByAllCategories(categories: string[]): Promise<Product[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where(`product.categories @> :categories`, {
        categories: [categories.join('&&')],
      })
      .getMany();

    return products;
  }

  async update(
    updatedId: number,
    updatedProductDto: ProductDto,
  ): Promise<Product> {
    const { categoryNames, ...productData } = updatedProductDto;
    const updatedProduct = await this.findById(updatedId);
    updatedProduct.price = productData.price;
    updatedProduct.stock = productData.stock;
    updatedProduct.thumbnail = productData.thumbnail;
    updatedProduct.title = productData.title;
    updatedProduct.description = productData.description;
    updatedProduct.categories =
      await this.findAndCreateCategoryByCategoryNames(categoryNames);

    return this.productRepository.save(updatedProduct);
  }

  async updatePrice(
    updatedId: number,
    newPrice: number,
  ): Promise<UpdateResult> {
    const theProduct = await this.productRepository.findOne({
      where: { productId: updatedId },
    });
    theProduct.price = newPrice;
    return this.productRepository.update(updatedId, theProduct);
  }

  async increaseStock(
    updatedId: number,
    increaseStock: number,
  ): Promise<UpdateResult> {
    const theProduct = await this.productRepository.findOne({
      where: { productId: updatedId },
    });
    theProduct.stock += increaseStock;
    return this.productRepository.update(updatedId, theProduct);
  }

  async findAndCreateCategoryByCategoryNames(
    categoryNames: string[],
  ): Promise<ProductCategory[]> {
    const categories: Array<ProductCategory> = [];

    for (const categoryName of categoryNames) {
      let theCategory = await this.findCategoryByCategoryName(categoryName);
      if (!theCategory) theCategory = await this.createCategory(categoryName);
      categories.push(theCategory);
    }

    return categories;
  }
}
