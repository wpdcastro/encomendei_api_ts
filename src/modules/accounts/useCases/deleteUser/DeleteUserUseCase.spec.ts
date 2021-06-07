import ICreateUserDTO from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

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

    expect(userAfterDelete).toBe(undefined);
  });
});
