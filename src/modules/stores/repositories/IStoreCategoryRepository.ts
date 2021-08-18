import { ICreateCategoryDTO } from '../dtos/ICreateCategoryDTO';
import { StoreCategory } from '../infra/typeorm/entities/StoreCategory';

export interface IStoreCategoryRepository {
  create(data: ICreateCategoryDTO): Promise<StoreCategory>;
  findByName(name: string): Promise<StoreCategory>;
  findByIds(ids: string[]): Promise<StoreCategory[]>;
}
