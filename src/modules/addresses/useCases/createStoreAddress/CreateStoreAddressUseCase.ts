import {
  Address,
  AddressType,
} from '@modules/addresses/infra/typeorm/entities/Address';
import { IAddressRepository } from '@modules/addresses/repositories/IAddressRepository';
import { IStoresRepository } from '@modules/stores/repositories/IStoresRepository';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number?: string;
  cep: string;
  apartment_number?: string;
  type_address: AddressType;
  phone: number;
  additional_indications?: string;
  store_id?: string;
}

@injectable()
class CreateStoreAddressUseCase {
  constructor(
    @inject('AddressesRepository')
    private addressRepository: IAddressRepository,

    @inject('StoresRepository')
    private storeRepository: IStoresRepository,
  ) {}

  async execute({
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
  }: IRequest): Promise<Address> {
    const storeAlreadyExists = await this.storeRepository.findById(store_id);

    if (!storeAlreadyExists) {
      throw new AppError('Store do not exists');
    }

    const storeAddressExists = await this.addressRepository.findByStoreId(
      store_id,
    );

    if (storeAddressExists) {
      throw new AppError('address to this store already exists');
    }

    const address = await this.addressRepository.create({
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
    });

    return address;
  }
}

export { CreateStoreAddressUseCase };
