import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidV4 } from 'uuid';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider';
import AppError from '@shared/errors/AppError';

@injectable()
class SendConfirmationUserMailUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,

    @inject('EtherealMailProvider')
    private mailProvider: IMailProvider,
  ) {}
  async execute(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User Does not exists');
    }

    const templatePath = resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'confirmationMail.hbs',
    );

    const token = uuidV4();

    const expires_date = this.dateProvider.addHours(3);

    await this.usersTokensRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date,
    });

    const variables = {
      name: user.name,
      link: `${process.env.CONFIRMATION_MAIL_URL}${token}`,
    };

    const { email } = user;

    await this.mailProvider.sendMail(
      email,
      'Confirmação de Usuário',
      variables,
      templatePath,
    );
  }
}

export { SendConfirmationUserMailUseCase };
