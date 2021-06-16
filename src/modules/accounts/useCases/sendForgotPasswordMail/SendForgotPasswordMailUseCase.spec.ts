import ICreateUserDTO from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/InMemory/MailProviderInMemory';
import AppError from '@shared/errors/AppError';

import CreateUserUseCase from '../createUser/CreateUserUseCase';
import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

let usersRepository: UsersRepositoryInMemory;
let usersTokensRepository: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

let createUserUseCase: CreateUserUseCase;
let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;

describe('Send forgot password mail', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
      mailProvider,
    );
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to send forgot password mail to user', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    const userCpf = cpfValidator.generate();

    const user: ICreateUserDTO = {
      name: 'Isabella Mills',
      email: 'komkumela@odmilfes.ee',
      password: '12s345s68sj',
      cpf: userCpf,
      isShopkeeper: false,
    };

    await createUserUseCase.execute(user);

    await sendForgotPasswordMailUseCase.execute(user.email);

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send forgot password email if users dows not exists', async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute('invalid@email.com'),
    ).rejects.toEqual(new AppError('User does not exists'));
  });
});
