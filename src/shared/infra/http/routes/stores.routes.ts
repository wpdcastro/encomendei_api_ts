import { CreateStoreAddressController } from '@modules/stores/useCases/createAddress/CreateStoreAddressController';
import { CreateCategoryStoresController } from '@modules/stores/useCases/createCategoryStores/CreateCategoryStoresController';
import { CreateStoreController } from '@modules/stores/useCases/createStore/CreateStoreController';
import { CreateStoreCategoryController } from '@modules/stores/useCases/createStoreCategory/CreateStoreCategoryController';
import { DeleteStoreController } from '@modules/stores/useCases/deleteStore/DeleteStoreController';
import { UpdateStoreAddressStoreController } from '@modules/stores/useCases/updateAddressStore/UpdateAddressStoreController';
import { UpdateStoreController } from '@modules/stores/useCases/updateStore/UpdateStoreController';
import { Router } from 'express';

import { ensureAdmin } from '../middlewares/ensureAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ensureShopkeeper from '../middlewares/ensureShopkeeper';

const storesRoutes = Router();

const createStoreController = new CreateStoreController();
const createStoreAddressController = new CreateStoreAddressController();
const deleteStoreController = new DeleteStoreController();
const updateStoreController = new UpdateStoreController();
const updateAddressStoreController = new UpdateStoreAddressStoreController();
const createStoreCategoryController = new CreateStoreCategoryController();
const createCategoryStoresController = new CreateCategoryStoresController();

storesRoutes.post('/', ensureAuthenticated, createStoreController.handle);

storesRoutes.post(
  '/address',
  ensureAuthenticated,
  createStoreAddressController.handle,
);

storesRoutes.delete(
  '/delete',
  ensureAuthenticated,
  deleteStoreController.handle,
);

storesRoutes.put(
  '/update',
  ensureAuthenticated,
  ensureShopkeeper,
  updateStoreController.handle,
);

storesRoutes.put(
  '/update/address',
  ensureAuthenticated,
  ensureShopkeeper,
  updateAddressStoreController.handle,
);

storesRoutes.post(
  '/category',
  ensureAuthenticated,
  ensureAdmin,
  createStoreCategoryController.handle,
);

storesRoutes.post(
  '/categories',
  ensureAuthenticated,
  ensureShopkeeper,
  createCategoryStoresController.handle,
);

export default storesRoutes;
