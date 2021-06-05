import { IUsersResponseDTO } from '@modules/accounts/dtos/IUserResponseDTO';
import { UserMap } from '@modules/accounts/mappers/UserMap';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class ShowProfileUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(id: string): Promise<IUsersResponseDTO> {
    const user = await this.usersRepository.findById(id);

    return UserMap.toDTO(user);
  }
}

export { ShowProfileUserUseCase };
