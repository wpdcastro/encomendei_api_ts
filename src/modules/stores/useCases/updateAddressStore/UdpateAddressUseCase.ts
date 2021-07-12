import {
  Address,
  AddressType,
} from '@modules/stores/infra/typeorm/entities/Address';
import { IAddressRepository } from '@modules/stores/repositories/IAddressRepository';
import { inject, injectable } from 'tsyringe';

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
  store_id: string;
}

@injectable()
class UpdateStoreAddressStoreUseCase {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressRepository,
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
    const { id } = await this.addressesRepository.findByStoreId(store_id);

    const updatedAddress = await this.addressesRepository.create({
      id,
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

    return updatedAddress;
  }
}

export { UpdateStoreAddressStoreUseCase };
