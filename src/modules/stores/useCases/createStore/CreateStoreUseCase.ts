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
}

@injectable()
class CreateStoreUseCase {
  constructor(
    @inject('StoresRepository')
    private storeRepository: IStoresRepository,
  ) {}

  async execute({
    name,
    description,
    cnpj,
    phone,
    isDelivery,
    user_id,
  }: IRequest): Promise<Store> {
    if (cnpj.length !== 14) {
      throw new AppError('Invalid field, must be 14 digits for cnpj');
    }

    const cnpjIsValid = cnpjValidator.isValid(cnpj);

    if (!cnpjIsValid) {
      throw new AppError('CNPJ is invalid');
    }

    const storeAlreadyExists = await this.storeRepository.findByUserId(user_id);

    if (storeAlreadyExists) {
      throw new AppError('Store with this user already exists');
    }

    const cnpjAlreadyRegistered = await this.storeRepository.findByCnpj(cnpj);

    if (cnpjAlreadyRegistered) {
      throw new AppError('this cnpj is already registered');
    }

    const store = await this.storeRepository.create({
      name,
      description,
      cnpj,
      phone,
      isDelivery,
      user_id,
    });

    return store;
  }
}

export { CreateStoreUseCase };
