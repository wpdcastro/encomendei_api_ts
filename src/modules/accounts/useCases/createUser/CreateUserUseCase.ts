/* eslint-disable import-helpers/order-imports */
import { inject, injectable } from 'tsyringe';
import { hash } from 'bcrypt';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

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
    cpf,
    email,
    isShopkeeper,
  }: ICreateUserDTO): Promise<void> {
    const cpfIsValid = cpfValidator.isValid(cpf);

    if (!cpfIsValid) {
      throw new AppError('CPF is invalid');
    }

    const userAlreadyExistsWithCpf = await this.usersRepository.findByCpf(cpf);

    if (userAlreadyExistsWithCpf) {
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
      cpf,
      password: passwordHash,
      isShopkeeper,
    });
  }
}
