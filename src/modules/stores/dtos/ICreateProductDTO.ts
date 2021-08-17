export interface ICreateProductDTO {
  id?: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  store_id: string;
  updated_at?: Date;
}
