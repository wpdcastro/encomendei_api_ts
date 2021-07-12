import { Store } from '@modules/stores/infra/typeorm/entities/Store';
import { IStoresRepository } from '@modules/stores/repositories/IStoresRepository';
import { cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { inject, injectable } from 'tsyringe';

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

    const store = await this.storeRepository.create({
      id: store_id,
      name,
      description,
      phone,
      isDelivery,
      user_id,
    });

    return store;
  }
}

export { UpdateStoreUseCase };
