import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import { compare } from 'bcrypt';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

@injectable()
class DeleteUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(id: string, password: string): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Password is incorrect');
    }

    await this.usersRepository.deleteUserById(id);
  }
}

export { DeleteUserUseCase };
