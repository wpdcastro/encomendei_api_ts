import { CreateStoreAddressController } from '@modules/stores/useCases/createAddress/CreateStoreAddressController';
import { CreateStoreController } from '@modules/stores/useCases/createStore/CreateStoreController';
import { DeleteStoreController } from '@modules/stores/useCases/deleteStore/DeleteStoreController';
import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const storesRoutes = Router();

const createStoreController = new CreateStoreController();
const createStoreAddressController = new CreateStoreAddressController();
const deleteStoreController = new DeleteStoreController();

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

export default storesRoutes;
