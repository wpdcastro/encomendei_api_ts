import { CreateStoreAddressController } from '@modules/stores/useCases/createAddress/CreateStoreAddressController';
import { CreateStoreController } from '@modules/stores/useCases/createStore/CreateStoreController';
import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const storesRoutes = Router();

const createStoreController = new CreateStoreController();
const createStoreAddressController = new CreateStoreAddressController();

storesRoutes.post('/', ensureAuthenticated, createStoreController.handle);

storesRoutes.post(
  '/address',
  ensureAuthenticated,
  createStoreAddressController.handle,
);

export default storesRoutes;
