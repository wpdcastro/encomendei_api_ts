import { ICreateStoreAddressDTO } from '../dtos/ICreateStoreAddressDTO';
import { Address } from '../infra/typeorm/entities/Address';

export interface IAddressRepository {
  create(data: ICreateStoreAddressDTO): Promise<Address>;
  findByStoreId(store_id: string): Promise<Address>;
}
