import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { ProductCategory } from './ProductCategory';
import { Store } from './Store';

@Entity('products')
class Product {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  isActive: boolean;

  @Column()
  store_id: string;

  @ManyToOne(() => Store, store => store.products)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToMany(() => ProductCategory)
  @JoinTable({
    name: 'products_categories_products',
    joinColumns: [{ name: 'product_id' }],
    inverseJoinColumns: [{ name: 'product_category_id' }],
  })
  productCategories: ProductCategory[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Product };
