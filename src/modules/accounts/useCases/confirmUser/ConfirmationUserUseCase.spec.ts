import ICreateUserDTO from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { v4 as uuidV4 } from 'uuid';

import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import AppError from '@shared/errors/AppError';

import { ConfirmationUserUseCase } from './ConfirmationUserUseCase';

let usersTokensRepository: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersRepository: UsersRepositoryInMemory;
let confirmationUserUseCase: ConfirmationUserUseCase;

describe('Confirmation User', () => {
  beforeEach(() => {
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    dateProvider = new DayjsDateProvider();

    confirmationUserUseCase = new ConfirmationUserUseCase(
      usersTokensRepository,
      dateProvider,
      usersRepository,
    );
  });

  it('should be able to confirm an user with token', async () => {
    const userCpf = cpfValidator.generate();

    const user: ICreateUserDTO = {
      name: 'Polly McLaughlin',
      email: 'da@juta.fj',
      password: '1234568j',
      cpf: userCpf,
      isShopkeeper: false,
    };

    await usersRepository.create(user);

    const userToConfirm = await usersRepository.findByCpf(userCpf);

    const expires_date = dateProvider.addHours(3);

    const token = uuidV4();

    await usersTokensRepository.create({
      refresh_token: token,
      user_id: userToConfirm.id,
      expires_date,
    });

    const beforeToConfirm = await usersTokensRepository.findByRefreshToken(
      token,
    );

    await confirmationUserUseCase.execute(token);

    const afterToConfirm = await usersTokensRepository.findByRefreshToken(
      token,
    );

    expect(userToConfirm.confirmedEmail).toBe(true);
    expect(beforeToConfirm).toHaveProperty('id');
    expect(afterToConfirm).toBe(undefined);
  });

  it('should not be able to confirm an user with invalid token', async () => {
    const token = 'invalidToken';

    await expect(confirmationUserUseCase.execute(token)).rejects.toEqual(
      new AppError('token invalid'),
    );
  });

  it('should not be able to confirm an user with token expired', async () => {
    const userCpf = cpfValidator.generate();

    const user: ICreateUserDTO = {
      name: 'Sara Floyd',
      email: 'soza@muupwa.tk',
      password: '1234568jk',
      cpf: userCpf,
      isShopkeeper: false,
    };

    await usersRepository.create(user);

    const userToConfirm = await usersRepository.findByCpf(userCpf);

    const expires_date = new Date('2020-05-20');

    const token = uuidV4();

    await usersTokensRepository.create({
      refresh_token: token,
      user_id: userToConfirm.id,
      expires_date,
    });

    await expect(confirmationUserUseCase.execute(token)).rejects.toEqual(
      new AppError('token expired'),
    );
  });
});
