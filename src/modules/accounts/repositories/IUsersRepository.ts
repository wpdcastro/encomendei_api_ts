import ICreateUserDTO from '../dtos/ICreateUserDTO';
import { User } from '../infra/typeorm/entities/user';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<void>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
  findByCpfOrCnpj(cpfOrCnpj: string): Promise<User>;
  deleteUserById(id: string): Promise<void>;
}
