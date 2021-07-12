import { StoreCategory } from '@modules/stores/infra/typeorm/entities/StoreCategory';
import { IStoreCategoryRepository } from '@modules/stores/repositories/IStoreCategoryRepository';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

@injectable()
class CreateStoreCategoryUseCase {
  constructor(
    @inject('StoreCategoryRepository')
    private storeCategoryRepository: IStoreCategoryRepository,
  ) {}

  async execute(name: string, color: string): Promise<StoreCategory> {
    const storeCategoryAlreadyExists =
      await this.storeCategoryRepository.findByName(name);

    if (storeCategoryAlreadyExists) {
      throw new AppError('Category Already Exists');
    }

    const storeCategory = await this.storeCategoryRepository.create({
      name,
      color,
    });

    return storeCategory;
  }
}

export { CreateStoreCategoryUseCase };
