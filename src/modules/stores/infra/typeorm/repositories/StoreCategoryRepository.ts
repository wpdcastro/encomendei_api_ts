import { ICreateStoreCategoryDTO } from '@modules/stores/dtos/ICreateStoreCategoryDTO';
import { IStoreCategoryRepository } from '@modules/stores/repositories/IStoreCategoryRepository';
import { getRepository, Repository } from 'typeorm';

import { StoreCategory } from '../entities/StoreCategory';

class StoreCategoryRepository implements IStoreCategoryRepository {
  private repository: Repository<StoreCategory>;

  constructor() {
    this.repository = getRepository(StoreCategory);
  }

  async create({
    id,
    updated_at,
    name,
    color,
  }: ICreateStoreCategoryDTO): Promise<StoreCategory> {
    const StoreCategory = this.repository.create({
      id,
      name,
      color,
      updated_at,
    });

    await this.repository.save(StoreCategory);

    return StoreCategory;
  }

  async findByName(name: string): Promise<StoreCategory> {
    const storeCategory = await this.repository.findOne({ name });

    return storeCategory;
  }
}

export { StoreCategoryRepository };
