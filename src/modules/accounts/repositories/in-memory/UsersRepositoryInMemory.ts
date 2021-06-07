import ICreateUserDTO from '@modules/accounts/dtos/ICreateUserDTO';
import { User } from '@modules/accounts/infra/typeorm/entities/user';

import IUsersRepository from '../IUsersRepository';

class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];

  async create({
    name,
    email,
    cpf,
    password,
    isShopkeeper,
  }: ICreateUserDTO): Promise<void> {
    const user = new User();

    Object.assign(user, {
      name,
      email,
      cpf,
      password,
      isShopkeeper,
    });

    this.users.push(user);
  }
  async findByEmail(email: string): Promise<User> {
    return this.users.find(user => user.email === email);
  }
  async findById(id: string): Promise<User> {
    return this.users.find(user => user.id === id);
  }
  async findByCpf(cpf: string): Promise<User> {
    return this.users.find(user => user.cpf === cpf);
  }
  async deleteUserById(id: string): Promise<void> {
    const user = this.users.find(user => user.id === id);

    this.users.splice(this.users.indexOf(user));
  }
}

export { UsersRepositoryInMemory };
