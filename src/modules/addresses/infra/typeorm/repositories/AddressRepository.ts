import { ICreateAddressDTO } from '@modules/addresses/dtos/ICreateAddressDTO';
import { Address } from '@modules/addresses/infra/typeorm/entities/Address';
import { IAddressRepository } from '@modules/addresses/repositories/IAddressRepository';
import { getRepository, Repository } from 'typeorm';

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
    user_id,
    id,
    updated_at,
  }: ICreateAddressDTO): Promise<Address> {
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
      user_id,
      id,
      updated_at,
    });

    await this.repository.save(Address);

    return Address;
  }

  async findByStoreId(store_id: string): Promise<Address> {
    return this.repository.findOne({ store_id });
  }

  async findByUserId(user_id: string): Promise<Address> {
    return this.repository.findOne({ user_id });
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { AddressRepository };
