import ICreateUserDTO from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { v4 as uuidV4 } from 'uuid';

import AppError from '@shared/errors/AppError';

import CreateUserUseCase from '../createUser/CreateUserUseCase';
import { ShowProfileUserUseCase } from './ShowProfileUserUseCase';

let usersRepository: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let showProfileUserUseCase: ShowProfileUserUseCase;

describe('show profile user', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    showProfileUserUseCase = new ShowProfileUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to show an user profile', async () => {
    const userCpf = cpfValidator.generate();

    const user: ICreateUserDTO = {
      name: 'Ethel Simpson',
      email: 'zatuw@hejfif.li',
      password: '12345s68sj',
      cpf: userCpf,
      isShopkeeper: false,
    };

    await createUserUseCase.execute(user);

    const userCreated = await usersRepository.findByCpf(userCpf);

    const result = await showProfileUserUseCase.execute(userCreated.id);

    expect(result.email).toEqual(user.email);
    expect(result.cpf).toEqual(userCpf);
    expect(result.name).toEqual(user.name);
    expect(result.id).toEqual(userCreated.id);
    expect(result).not.toHaveProperty('password');
  });

  it('should not to be able to show profile user with an invalid id', async () => {
    const id = uuidV4();

    await expect(showProfileUserUseCase.execute(id)).rejects.toEqual(
      new AppError('User does not exists'),
    );
  });
});
