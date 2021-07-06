import { User } from '@modules/accounts/infra/typeorm/entities/user';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { Address } from './Address';
import { StoreCategory } from './StoreCategoy';

@Entity('stores')
class Store {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  cnpj?: string;

  @Column()
  phone: string;

  @Column()
  isDelivery: boolean;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @OneToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column()
  address_id?: string;

  @ManyToMany(() => StoreCategory)
  @JoinTable({
    name: 'stores_categories_stores',
    joinColumns: [{ name: 'store_id' }],
    inverseJoinColumns: [{ name: 'store_category_id' }],
  })
  storeCategories?: StoreCategory[];

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

export { Store };
