import {
  Column,
  CreateDateColumn,
  Entity,
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
  number?: string;

  @Column()
  apartment_number?: string;

  @Column({ type: 'enum', enum: AddressType })
  type_address: AddressType;

  @Column()
  phone: string;

  @Column()
  additional_indications?: string;

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
