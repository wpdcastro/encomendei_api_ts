import ICreateUserDTO from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { v4 as uuidV4 } from 'uuid';

import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/InMemory/MailProviderInMemory';
import AppError from '@shared/errors/AppError';

import CreateUserUseCase from '../createUser/CreateUserUseCase';
import { SendConfirmationUserMailUseCase } from './SendConfirmationUserMailUseCase';

let usersRepository: UsersRepositoryInMemory;
let usersTokensRepository: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

let createUserUseCase: CreateUserUseCase;
let sendConfirmationUserMailUseCase: SendConfirmationUserMailUseCase;

describe('send confirmation email', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();

    sendConfirmationUserMailUseCase = new SendConfirmationUserMailUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
      mailProvider,
    );
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to send confirmation user mail', async () => {
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

    const userCreated = await usersRepository.findByCpf(userCpf);

    await sendConfirmationUserMailUseCase.execute(userCreated.id);

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send email to invalid user id', async () => {
    const id = uuidV4();

    await expect(sendConfirmationUserMailUseCase.execute(id)).rejects.toEqual(
      new AppError('User Does not exists'),
    );
  });
});
