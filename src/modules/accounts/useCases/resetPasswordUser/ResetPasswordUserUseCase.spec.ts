import ICreateUserDTO from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { compare } from 'bcrypt';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { v4 as uuidV4 } from 'uuid';

import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import AppError from '@shared/errors/AppError';

import AuthenticateUserUseCase from '../authenticateUser/AuthenticateUserUseCase';
import CreateUserUseCase from '../createUser/CreateUserUseCase';
import { ResetPasswordUserUseCase } from './ResetPasswordUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

let usersTokensRepository: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersRepository: UsersRepositoryInMemory;
let resetPasswordUserUseCase: ResetPasswordUserUseCase;

describe('Reset user password', () => {
  beforeEach(() => {
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    usersRepository = new UsersRepositoryInMemory();

    resetPasswordUserUseCase = new ResetPasswordUserUseCase(
      usersTokensRepository,
      dateProvider,
      usersRepository,
    );

    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
    );

    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to reset the user password', async () => {
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

    const token = userAuthenticated.refresh_token;

    const password = 'newPassword';

    await resetPasswordUserUseCase.execute({ token, password });

    const userAfterReset = await usersRepository.findByCpf(userCpf);

    const passwordAfterReset = await compare(password, userAfterReset.password);

    expect(passwordAfterReset).toBe(true);
  });

  it('should not be able to reset user password with invalid token', async () => {
    const token = uuidV4();

    const password = 'newPassword';

    await expect(
      resetPasswordUserUseCase.execute({ token, password }),
    ).rejects.toEqual(new AppError('token invalid'));
  });

  it('should not be able to reset user password with token expired', async () => {
    const userCpf = cpfValidator.generate();

    const user: ICreateUserDTO = {
      name: 'Evan Jordan',
      email: 'ereweofe@vartes.to',
      password: '1234568sj',
      cpf: userCpf,
      isShopkeeper: false,
    };

    await createUserUseCase.execute(user);

    const userToReset = await usersRepository.findByCpf(userCpf);

    const token = uuidV4();

    const expires_date = new Date('2021-06-15');

    await usersTokensRepository.create({
      refresh_token: token,
      user_id: userToReset.id,
      expires_date,
    });

    const password = 'resetPassword';

    await expect(
      resetPasswordUserUseCase.execute({ token, password }),
    ).rejects.toEqual(new AppError('token expired'));
  });
});
