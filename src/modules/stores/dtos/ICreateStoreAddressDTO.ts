import { AddressType } from '../infra/typeorm/entities/Address';

export interface ICreateStoreAddressDTO {
  id?: string;
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
  updated_at?: Date;
}
