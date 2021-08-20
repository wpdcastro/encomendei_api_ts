import { Address } from '@modules/addresses/infra/typeorm/entities/Address';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('users')
class User {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  confirmedEmail: boolean;

  @Column()
  cpf: string;

  @Column()
  password: string;

  @Column()
  isAdmin?: boolean;

  @Column()
  isShopkeeper: boolean;

  @OneToMany(() => Address, address => address.user)
  addresses: Address[];

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

export { User };
