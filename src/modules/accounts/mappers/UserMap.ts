import { classToClass } from 'class-transformer';

import { IUsersResponseDTO } from '../dtos/IUserResponseDTO';
import { User } from '../infra/typeorm/entities/user';

class UserMap {
  static toDTO({ email, name, cpf, id }: User): IUsersResponseDTO {
    const user = classToClass({
      email,
      name,
      cpf,
      id,
    });
    return user;
  }
}

export { UserMap };
