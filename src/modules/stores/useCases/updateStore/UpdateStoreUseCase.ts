import { Store } from '@modules/stores/infra/typeorm/entities/Store';
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
}

@injectable()
class UpdateStoreUseCase {
  constructor(
    @inject('StoresRepository')
    private storeRepository: IStoresRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({
    store_id,
    name,
    description,
    phone,
    isDelivery,
    user_id,
    cnpj,
  }: IRequest): Promise<Store> {
    if (cnpj) {
      const cnpjIsValid = cnpjValidator.isValid(cnpj);

      if (!cnpjIsValid) {
        throw new AppError('CNPJ is invalid');
      }
    }

    const cnpjAlreadyRegistered = await this.storeRepository.findByCnpj(cnpj);

    if (cnpjAlreadyRegistered) {
      throw new AppError('This cnpj is already registered');
    }

    const updated_at = this.dateProvider.dateNow();

    const store = await this.storeRepository.create({
      id: store_id,
      name,
      description,
      phone,
      isDelivery,
      user_id,
      updated_at,
    });

    return store;
  }
}

export { UpdateStoreUseCase };
