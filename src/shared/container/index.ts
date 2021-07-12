// eslint-disable-next-line import-helpers/order-imports
import { container } from 'tsyringe';

import '@shared/container/providers';

import UsersRepository from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { UsersTokensRepository } from '@modules/accounts/infra/typeorm/repositories/UserTokensRepository';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { AddressRepository } from '@modules/stores/infra/typeorm/repositories/AddressRepository';
import { StoreCategoryRepository } from '@modules/stores/infra/typeorm/repositories/StoreCategoryRepository';
import { StoresRepository } from '@modules/stores/infra/typeorm/repositories/StoresRepository';
import { IAddressRepository } from '@modules/stores/repositories/IAddressRepository';
import { IStoreCategoryRepository } from '@modules/stores/repositories/IStoreCategoryRepository';
import { IStoresRepository } from '@modules/stores/repositories/IStoresRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUsersTokensRepository>(
  'UsersTokensRepository',
  UsersTokensRepository,
);

container.registerSingleton<IStoresRepository>(
  'StoresRepository',
  StoresRepository,
);

container.registerSingleton<IAddressRepository>(
  'AddressesRepository',
  AddressRepository,
);

container.registerSingleton<IStoreCategoryRepository>(
  'StoreCategoryRepository',
  StoreCategoryRepository,
);
