import { IAddressRepository } from '@modules/addresses/repositories/IAddressRepository';
import { IStoresRepository } from '@modules/stores/repositories/IStoresRepository';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

@injectable()
class DeleteStoreUseCase {
  constructor(
    @inject('StoresRepository')
    private storeRepository: IStoresRepository,

    @inject('AddressesRepository')
    private addressRepository: IAddressRepository,
  ) {}

  async execute(user_id: string): Promise<void> {
    const store = await this.storeRepository.findByUserId(user_id);

    if (!store) {
      throw new AppError('Store with this user does not exists');
    }

    const address = await this.addressRepository.findByStoreId(store.id);

    if (address) {
      await this.addressRepository.deleteById(address.id);
    }

    await this.storeRepository.deleteById(store.id);
  }
}

export { DeleteStoreUseCase };
