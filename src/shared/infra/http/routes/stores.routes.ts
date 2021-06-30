import { CreateStoreController } from '@modules/stores/useCases/createStore/CreateStoreController';
import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const storesRoutes = Router();

const createStoreController = new CreateStoreController();

storesRoutes.post('/', ensureAuthenticated, createStoreController.handle);

export default storesRoutes;
