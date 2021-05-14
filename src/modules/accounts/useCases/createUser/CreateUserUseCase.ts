/* eslint-disable import-helpers/order-imports */
import { inject, injectable } from 'tsyringe';
import { hash } from 'bcrypt';

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
    email,
    isShopkeeper,
  }: ICreateUserDTO): Promise<void> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new AppError('User Already Exists');
    }

    const passwordHash = await hash(password, 8);

    await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      isShopkeeper,
    });
  }
}
