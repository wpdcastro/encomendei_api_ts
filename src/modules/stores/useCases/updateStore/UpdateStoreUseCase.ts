import { Store } from '@modules/stores/infra/typeorm/entities/Store';
import { IStoreCategoryRepository } from '@modules/stores/repositories/IStoreCategoryRepository';
import { IStoresRepository } from '@modules/stores/repositories/IStoresRepository';
import { cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { inject, injectable } from 'tsyringe';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  description: string;
  cnpj?: string;
  phone: string;
  isDelivery: boolean;
  user_id: string;
  store_id: string;
  storeCategories_id?: string[];
}

@injectable()
class UpdateStoreUseCase {
  constructor(
    @inject('StoresRepository')
    private storeRepository: IStoresRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,

    @inject('StoreCategoryRepository')
    private storeCategoryRepository: IStoreCategoryRepository,
  ) {}

  async execute({
    store_id,
    name,
    description,
    phone,
    isDelivery,
    user_id,
    cnpj,
    storeCategories_id,
  }: IRequest): Promise<Store> {
    if (cnpj) {
      const cnpjIsValid = cnpjValidator.isValid(cnpj);

      if (!cnpjIsValid) {
        throw new AppError('CNPJ is invalid');
      }
    }

    const cnpjAlreadyRegistered = await this.storeRepository.findByCnpj(cnpj);

    if (!cnpjAlreadyRegistered) {
      throw new AppError('No registered store with this cnpj to update');
    }

    const storesCategories = await this.storeCategoryRepository.findByIds(
      storeCategories_id,
    );

    if (!storesCategories) {
      throw new AppError('Categories does not exists');
    }

    const updated_at = this.dateProvider.dateNow();

    const store = await this.storeRepository.create({
      id: store_id,
      name,
      description,
      phone,
      isDelivery,
      cnpj,
      user_id,
      updated_at,
      storeCategories: storesCategories,
    });

    return store;
  }
}

export { UpdateStoreUseCase };
