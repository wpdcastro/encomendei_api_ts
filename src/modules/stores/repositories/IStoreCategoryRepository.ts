import { ICreateStoreCategoryDTO } from '../dtos/ICreateStoreCategoryDTO';
import { StoreCategory } from '../infra/typeorm/entities/StoreCategory';

export interface IStoreCategoryRepository {
  create(date: ICreateStoreCategoryDTO): Promise<StoreCategory>;
  findByName(name: string): Promise<StoreCategory>;
}
