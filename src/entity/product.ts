import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { ProductCategory } from './product-category';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column({ nullable: true })
  thumbnail: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => ProductCategory, { cascade: true })
  @JoinTable()
  categories: ProductCategory[];
}
