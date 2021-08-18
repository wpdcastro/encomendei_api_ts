import { ICreateCategoryDTO } from '@modules/stores/dtos/ICreateCategoryDTO';
import { IProductCategoryRepository } from '@modules/stores/repositories/IProductCategoryRepository';
import { getRepository, Repository } from 'typeorm';

import { ProductCategory } from '../entities/ProductCategory';

class ProductCategoryRepository implements IProductCategoryRepository {
  private repository: Repository<ProductCategory>;

  constructor() {
    this.repository = getRepository(ProductCategory);
  }

  async create({
    id,
    updated_at,
    name,
    color,
  }: ICreateCategoryDTO): Promise<ProductCategory> {
    const ProductCategory = this.repository.create({
      id,
      name,
      color,
      updated_at,
    });

    await this.repository.save(ProductCategory);

    return ProductCategory;
  }

  async findByName(name: string): Promise<ProductCategory> {
    const storeCategory = await this.repository.findOne({ name });

    return storeCategory;
  }

  async findByIds(ids: string[]): Promise<ProductCategory[]> {
    const storeCategories = await this.repository.findByIds(ids);

    return storeCategories;
  }
}

export { ProductCategoryRepository };
