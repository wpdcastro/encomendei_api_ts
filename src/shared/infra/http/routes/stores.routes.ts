import { CreateStoreAddressController } from '@modules/stores/useCases/createAddress/CreateStoreAddressController';
import { CreateStoreController } from '@modules/stores/useCases/createStore/CreateStoreController';
import { DeleteStoreController } from '@modules/stores/useCases/deleteStore/DeleteStoreController';
import { UpdateStoreAddressStoreController } from '@modules/stores/useCases/updateAddressStore/UpdateAddressStoreController';
import { UpdateStoreController } from '@modules/stores/useCases/updateStore/UpdateStoreController';
import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ensureShopkeeper from '../middlewares/ensureShopkeeper';

const storesRoutes = Router();

const createStoreController = new CreateStoreController();
const createStoreAddressController = new CreateStoreAddressController();
const deleteStoreController = new DeleteStoreController();
const updateStoreController = new UpdateStoreController();
const updateAddressStoreController = new UpdateStoreAddressStoreController();

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

export default storesRoutes;
