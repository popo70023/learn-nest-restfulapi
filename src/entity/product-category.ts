import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './product';

@Entity('product_category')
export class ProductCategory {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column()
  categoryName: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
