import { ProductCategory } from '@modules/stores/infra/typeorm/entities/ProductCategory';
import { IProductCategoryRepository } from '@modules/stores/repositories/IProductCategoryRepository';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

@injectable()
class CreateProductCategoryUseCase {
  constructor(
    @inject('ProductCategoryRepository')
    private productCategoryRepository: IProductCategoryRepository,
  ) {}

  async execute(name: string, color: string): Promise<ProductCategory> {
    const productCategoryAlreadyExists =
      await this.productCategoryRepository.findByName(name);

    if (productCategoryAlreadyExists) {
      throw new AppError('Product Already Exists');
    }

    const productCategory = await this.productCategoryRepository.create({
      name,
      color,
    });

    return productCategory;
  }
}

export { CreateProductCategoryUseCase };
