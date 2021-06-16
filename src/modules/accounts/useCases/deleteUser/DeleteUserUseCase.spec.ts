import ICreateUserDTO from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import AppError from '@shared/errors/AppError';

import CreateUserUseCase from '../createUser/CreateUserUseCase';
import { DeleteUserUseCase } from './DeleteUserUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let deleteUserUseCase: DeleteUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Delete an user', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    deleteUserUseCase = new DeleteUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to delete an user with id', async () => {
    const userCpf = cpfValidator.generate();

    const user: ICreateUserDTO = {
      name: 'Beulah Willis',
      email: 'dipagu@baji.es',
      password: '1234567',
      cpf: userCpf,
      isShopkeeper: false,
    };

    await createUserUseCase.execute(user);

    const userToDelete = await usersRepositoryInMemory.findByCpf(userCpf);

    await deleteUserUseCase.execute(userToDelete.id, user.password);

    const userAfterDelete = await usersRepositoryInMemory.findByCpf(userCpf);

    expect(userToDelete.cpf).toBe(userCpf);
    expect(userAfterDelete).toBe(undefined);
  });

  it('should not be able to delete an user with id invalid', async () => {
    await expect(
      deleteUserUseCase.execute('idinvalid', '123456'),
    ).rejects.toEqual(new AppError('User does not exists'));
  });

  it('should not be able to delete an user with invalid password', async () => {
    const userCpf = cpfValidator.generate();

    const user: ICreateUserDTO = {
      name: 'Barry Love',
      email: 'vo@hioc.mx',
      password: '1234567j',
      cpf: userCpf,
      isShopkeeper: false,
    };

    await createUserUseCase.execute(user);

    const userToDelete = await usersRepositoryInMemory.findByCpf(userCpf);

    await expect(
      deleteUserUseCase.execute(userToDelete.id, '123456'),
    ).rejects.toEqual(new AppError('Password is incorrect'));
  });
});
