import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
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

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    name,
    description,
    cnpj,
    phone,
    isDelivery,
    user_id,
  }: IRequest): Promise<Store> {
    if (cnpj) {
      const cnpjIsValid = cnpjValidator.isValid(cnpj);

      if (!cnpjIsValid) {
        throw new AppError('CNPJ is invalid');
      }
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

    const user = await this.usersRepository.findById(user_id);

    user.isShopkeeper = true;

    await this.usersRepository.create(user);

    return store;
  }
}

export { CreateStoreUseCase };
