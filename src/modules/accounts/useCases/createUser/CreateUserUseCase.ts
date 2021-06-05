/* eslint-disable import-helpers/order-imports */
import { inject, injectable } from 'tsyringe';
import { hash } from 'bcrypt';
import { cpf, cnpj } from 'cpf-cnpj-validator';

import ICreateUserDTO from '@modules/accounts/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

@injectable()
export default class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    name,
    password,
    cpfOrCnpj,
    email,
    isShopkeeper,
  }: ICreateUserDTO): Promise<void> {
    const cpfOrCnpjIsValid = cpfOrCnpj.length === 11 || cpfOrCnpj.length === 14;

    if (!cpfOrCnpjIsValid) {
      throw new AppError(
        'invalid field, must be 11 digits for cpf or 14 for cnpj',
      );
    }

    if (cpfOrCnpj.length === 11) {
      const cpfIsValid = cpf.isValid(cpfOrCnpj);

      if (!cpfIsValid) {
        throw new AppError('CPF is invalid');
      }
    }

    if (cpfOrCnpj.length === 14) {
      const cnpjIsValid = cnpj.isValid(cpfOrCnpj);

      if (!cnpjIsValid) {
        throw new AppError('CNPJ invalid');
      }
    }

    const userAlreadyExistsWithCpfOrCnpj =
      await this.usersRepository.findByCpfOrCnpj(cpfOrCnpj);

    if (userAlreadyExistsWithCpfOrCnpj) {
      throw new AppError('User Already Exists');
    }

    const userAlreadyExistsWithEmail = await this.usersRepository.findByEmail(
      email,
    );

    if (userAlreadyExistsWithEmail) {
      throw new AppError('User Already Exists');
    }

    const passwordHash = await hash(password, 8);

    await this.usersRepository.create({
      name,
      email,
      cpfOrCnpj,
      password: passwordHash,
      isShopkeeper,
    });
  }
}
