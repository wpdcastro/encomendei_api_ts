import { Address } from '@modules/addresses/infra/typeorm/entities/Address';

import { ICreateAddressDTO } from '../dtos/ICreateAddressDTO';

export interface IAddressRepository {
  create(data: ICreateAddressDTO): Promise<Address>;
  findByStoreId(store_id: string): Promise<Address>;
  findByUserId(user_id: string): Promise<Address>;
  deleteById(id: string): Promise<void>;
}
