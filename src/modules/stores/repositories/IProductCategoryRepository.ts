import { ICreateCategoryDTO } from '../dtos/ICreateCategoryDTO';
import { ProductCategory } from '../infra/typeorm/entities/ProductCategory';

export interface IProductCategoryRepository {
  create(data: ICreateCategoryDTO): Promise<ProductCategory>;
  findByName(name: string): Promise<ProductCategory>;
  findByIds(ids: string[]): Promise<ProductCategory[]>;
}
