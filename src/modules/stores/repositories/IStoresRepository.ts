import { ICreateStoreDTO } from '../dtos/ICreateStoreDTO';
import { Store } from '../infra/typeorm/entities/Store';

export interface IStoresRepository {
  create(data: ICreateStoreDTO): Promise<Store>;
  findByUserId(user_id: string): Promise<Store>;
  findByCnpj(cnpj: string): Promise<Store>;
}
