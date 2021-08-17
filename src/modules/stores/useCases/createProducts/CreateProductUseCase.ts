import { Product } from '@modules/stores/infra/typeorm/entities/Product';
import { IProductsRepository } from '@modules/stores/repositories/IProductsRepository';
import { IStoresRepository } from '@modules/stores/repositories/IStoresRepository';
import { inject, injectable } from 'tsyringe';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  store_id: string;
  id?: string;
}

@injectable()
class CreateProductUseCase {
  constructor(
    @inject('StoresRepository')
    private storesRepository: IStoresRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  async execute({
    name,
    description,
    price,
    isActive,
    store_id,
    id,
  }: IRequest): Promise<Product> {
    const store = this.storesRepository.findById(store_id);

    if (!store) {
      throw new AppError('Store does not exists');
    }

    if (id) {
      const updated_at = this.dateProvider.dateNow();

      const product = await this.productsRepository.create({
        id,
        name,
        description,
        price,
        isActive,
        store_id,
        updated_at,
      });

      return product;
    }

    const product = await this.productsRepository.create({
      name,
      description,
      price,
      isActive,
      store_id,
    });

    return product;
  }
}

export { CreateProductUseCase };
