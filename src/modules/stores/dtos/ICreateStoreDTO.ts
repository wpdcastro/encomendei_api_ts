import { StoreCategory } from '../infra/typeorm/entities/StoreCategoy';

export interface ICreateStoreDTO {
  id?: string;
  name: string;
  description: string;
  cnpj?: string;
  phone: string;
  isDelivery: boolean;
  user_id: string;
  address_id?: string;
  storeCategories?: StoreCategory[];
  updated_at?: Date;
}
