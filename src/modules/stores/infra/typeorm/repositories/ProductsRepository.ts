import { ICreateProductDTO } from '@modules/stores/dtos/ICreateProductDTO';
import { IProductsRepository } from '@modules/stores/repositories/IProductsRepository';
import { getRepository, Repository } from 'typeorm';

import { Product } from '../entities/Product';

class ProductsRepository implements IProductsRepository {
  private repository: Repository<Product>;

  constructor() {
    this.repository = getRepository(Product);
  }

  async create({
    name,
    description,
    isActive,
    price,
    store_id,
    id,
    updated_at,
  }: ICreateProductDTO): Promise<Product> {
    const Product = this.repository.create({
      name,
      description,
      isActive,
      price,
      store_id,
      id,
      updated_at,
    });

    await this.repository.save(Product);

    return Product;
  }
}

export { ProductsRepository };
