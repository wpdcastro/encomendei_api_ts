import { Store } from '@modules/stores/infra/typeorm/entities/Store';
import { IStoreCategoryRepository } from '@modules/stores/repositories/IStoreCategoryRepository';
import { IStoresRepository } from '@modules/stores/repositories/IStoresRepository';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

interface IRequest {
  store_id: string;
  storeCategories_id: string[];
}

@injectable()
class CreateCategoryStoresUseCase {
  constructor(
    @inject('StoreCategoryRepository')
    private storeCategoryRepository: IStoreCategoryRepository,

    @inject('StoresRepository')
    private storesRepository: IStoresRepository,
  ) {}

  async execute({ store_id, storeCategories_id }: IRequest): Promise<Store> {
    const storeExists = await this.storesRepository.findById(store_id);

    if (!storeExists) {
      throw new AppError('Store does not exists');
    }

    const storesCategories = await this.storeCategoryRepository.findByIds(
      storeCategories_id,
    );

    storeExists.storeCategories = storesCategories;

    await this.storesRepository.create(storeExists);

    return storeExists;
  }
}

export { CreateCategoryStoresUseCase };
