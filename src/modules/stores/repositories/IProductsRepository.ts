import { ICreateProductDTO } from '../dtos/ICreateProductDTO';
import { Product } from '../infra/typeorm/entities/Product';

export interface IProductsRepository {
  create(data: ICreateProductDTO): Promise<Product>;
  findById(id: string): Promise<Product>;
}
