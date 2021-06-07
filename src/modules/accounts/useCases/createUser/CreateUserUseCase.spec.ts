import ICreateUserDTO from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import AppError from '@shared/errors/AppError';

import CreateUserUseCase from './CreateUserUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe('Create an User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to create a new user', async () => {
    const userCpf = cpfValidator.generate();

    const user: ICreateUserDTO = {
      name: 'Harriet Medina',
      email: 'reohe@ne.ph',
      password: '123456',
      cpf: userCpf,
      isShopkeeper: false,
    };

    await createUserUseCase.execute(user);

    const result = await usersRepositoryInMemory.findByEmail(user.email);

    expect(result).toHaveProperty('id');
    expect(result.cpf).toEqual(userCpf);
    expect(result.name).toEqual(user.name);
    expect(result.isShopkeeper).toEqual(false);
  });

  it('should not be able to create an new user with cpf without 11 digits', async () => {
    const user: ICreateUserDTO = {
      name: 'John Chapman',
      email: 'ecsi@nu.bb',
      password: '1234567',
      cpf: '0000000',
      isShopkeeper: true,
    };

    await expect(createUserUseCase.execute(user)).rejects.toEqual(
      new AppError('Invalid field, must be 11 digits for cpf'),
    );
  });

  it('should not be able to create an new user with invalid cpf', async () => {
    const user: ICreateUserDTO = {
      name: 'John Chapman',
      email: 'ecsi@nu.bb',
      password: '1234567',
      cpf: '00000000000',
      isShopkeeper: true,
    };

    await expect(createUserUseCase.execute(user)).rejects.toEqual(
      new AppError('CPF is invalid'),
    );
  });

  it('should not be able to create an new user with existent CPF in database', async () => {
    const userCpf = cpfValidator.generate();

    const user: ICreateUserDTO = {
      name: 'Nettie Shelton',
      email: 'gowu@apepi.vg',
      password: '12345',
      cpf: userCpf,
      isShopkeeper: false,
    };

    await createUserUseCase.execute(user);

    const user2: ICreateUserDTO = {
      name: 'Jeffery Dixon',
      email: 'go@za.sy',
      password: '12345689',
      cpf: userCpf,
      isShopkeeper: false,
    };

    await expect(createUserUseCase.execute(user2)).rejects.toEqual(
      new AppError('User Already Exists'),
    );
  });

  it('should not be able to create a new user with email existent in database', async () => {
    const userCpf = cpfValidator.generate();

    const user: ICreateUserDTO = {
      name: 'Catherine Quinn',
      email: 'riocaapi@pedhon.ki',
      password: '12345786',
      cpf: userCpf,
      isShopkeeper: false,
    };

    await createUserUseCase.execute(user);

    const userCpf2 = cpfValidator.generate();

    const user2: ICreateUserDTO = {
      name: 'Norman Brock',
      email: 'riocaapi@pedhon.ki',
      password: '123457868',
      cpf: userCpf2,
      isShopkeeper: false,
    };

    await expect(createUserUseCase.execute(user2)).rejects.toEqual(
      new AppError('User Already Exists'),
    );
  });
});
