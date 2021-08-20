import { User } from '@modules/accounts/infra/typeorm/entities/user';
import { Store } from '@modules/stores/infra/typeorm/entities/Store';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

export enum AddressType {
  WORK = 'work',
  HOUSE = 'house',
}

@Entity('addresses')
class Address {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  street: string;

  @Column()
  cep: string;

  @Column()
  number?: string;

  @Column()
  apartment_number?: string;

  @Column({ type: 'enum', enum: AddressType })
  type_address: AddressType;

  @Column()
  phone: number;

  @Column()
  additional_indications?: string;

  @Column()
  store_id?: string;

  @OneToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  user_id?: string;

  @ManyToOne(() => User, user => user.addresses)
  @JoinColumn({ name: 'user_id' })
  user: User;

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

export { Address };
