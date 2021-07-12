import { ICreateStoreAddressDTO } from '@modules/stores/dtos/ICreateStoreAddressDTO';
import { IAddressRepository } from '@modules/stores/repositories/IAddressRepository';
import { getRepository, Repository } from 'typeorm';

import { Address } from '../entities/Address';

class AddressRepository implements IAddressRepository {
  private repository: Repository<Address>;

  constructor() {
    this.repository = getRepository(Address);
  }

  async create({
    name,
    state,
    city,
    district,
    street,
    number,
    cep,
    apartment_number,
    type_address,
    phone,
    additional_indications,
    store_id,
    id,
    updated_at,
  }: ICreateStoreAddressDTO): Promise<Address> {
    const Address = this.repository.create({
      name,
      state,
      city,
      district,
      street,
      number,
      cep,
      apartment_number,
      type_address,
      phone,
      additional_indications,
      store_id,
      id,
      updated_at,
    });

    await this.repository.save(Address);

    return Address;
  }

  async findByStoreId(store_id: string): Promise<Address> {
    return this.repository.findOne({ store_id });
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { AddressRepository };
