import ICreateUserDTO from '@modules/accounts/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import { getRepository, Repository } from 'typeorm';

import { User } from '../entities/user';

export default class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create({
    name,
    email,
    password,
    isShopkeeper,
    id,
  }: ICreateUserDTO): Promise<void> {
    const user = this.repository.create({
      name,
      email,
      password,
      isShopkeeper,
      id,
    });

    await this.repository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ email });

    return user;
  }
  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne(id);

    return user;
  }
}
