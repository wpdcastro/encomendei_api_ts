import ICreateUserDTO from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import AppError from '@shared/errors/AppError';

import AuthenticateUserUseCase from '../authenticateUser/AuthenticateUserUseCase';
import CreateUserUseCase from '../createUser/CreateUserUseCase';
import { RefreshTokenUseCase } from './RefreshTokenUseCase';

let usersRepository: UsersRepositoryInMemory;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

let usersTokensRepository: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let refreshTokenUseCase: RefreshTokenUseCase;

describe('Create refresh token', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();

    usersTokensRepository = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    refreshTokenUseCase = new RefreshTokenUseCase(
      usersTokensRepository,
      dateProvider,
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
    );

    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to create a new refresh token', async () => {
    const userCpf = cpfValidator.generate();

    const user: ICreateUserDTO = {
      name: 'Evan Jordan',
      email: 'ereweofe@vartes.to',
      password: '1234568sj',
      cpf: userCpf,
      isShopkeeper: false,
    };

    await createUserUseCase.execute(user);

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const result = await refreshTokenUseCase.execute(
      userAuthenticated.refresh_token,
    );

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('refresh_token');
  });

  it('should not be able to create a new refresh token with invalid token', async () => {
    const userCpf = cpfValidator.generate();

    const user: ICreateUserDTO = {
      name: 'Gordon Castillo',
      email: 'rahus@neggen.rs',
      password: '1234568sjs',
      cpf: userCpf,
      isShopkeeper: false,
    };

    await createUserUseCase.execute(user);

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const userToken = await usersTokensRepository.findByRefreshToken(
      userAuthenticated.refresh_token,
    );

    await usersTokensRepository.deleteById(userToken.id);

    await expect(
      refreshTokenUseCase.execute(userAuthenticated.refresh_token),
    ).rejects.toEqual(new AppError('Refresh token does not exists'));
  });
});
