import { ICreateStoreDTO } from '@modules/stores/dtos/ICreateStoreDTO';
import { IStoresRepository } from '@modules/stores/repositories/IStoresRepository';
import { getRepository, Repository } from 'typeorm';

import { Store } from '../entities/Store';

class StoresRepository implements IStoresRepository {
  private repository: Repository<Store>;

  constructor() {
    this.repository = getRepository(Store);
  }

  async create({
    name,
    description,
    isDelivery,
    phone,
    storeCategories,
    user_id,
    address_id,
    cnpj,
    updated_at,
    id,
  }: ICreateStoreDTO): Promise<Store> {
    const Store = this.repository.create({
      name,
      description,
      isDelivery,
      phone,
      storeCategories,
      user_id,
      address_id,
      cnpj,
      updated_at,
      id,
    });

    await this.repository.save(Store);

    return Store;
  }

  async findByUserId(user_id: string): Promise<Store> {
    const store = await this.repository.findOne({ user_id });

    return store;
  }

  async findByCnpj(cnpj: string): Promise<Store> {
    const store = await this.repository.findOne({ cnpj });

    return store;
  }
}

export { StoresRepository };
