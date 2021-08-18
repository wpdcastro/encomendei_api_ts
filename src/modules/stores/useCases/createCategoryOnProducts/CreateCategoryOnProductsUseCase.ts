import { Product } from '@modules/stores/infra/typeorm/entities/Product';
import { IProductCategoryRepository } from '@modules/stores/repositories/IProductCategoryRepository';
import { IProductsRepository } from '@modules/stores/repositories/IProductsRepository';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

interface IRequest {
  product_id: string;
  productCategories_id: string[];
}

@injectable()
class CreateCategoryOnProductsUseCase {
  constructor(
    @inject('ProductCategoryRepository')
    private productCategoryRepository: IProductCategoryRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  async execute({
    product_id,
    productCategories_id,
  }: IRequest): Promise<Product> {
    const productExists = await this.productsRepository.findById(product_id);

    if (!productExists) {
      throw new AppError('Product does not exists');
    }

    const productsCategories = await this.productCategoryRepository.findByIds(
      productCategories_id,
    );

    if (!productsCategories) {
      throw new AppError('Categories does not exists');
    }

    productExists.productCategories = productsCategories;

    await this.productsRepository.create(productExists);

    return productExists;
  }
}

export { CreateCategoryOnProductsUseCase };
