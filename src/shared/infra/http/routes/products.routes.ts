import { CreateProductController } from '@modules/stores/useCases/createProducts/CreateProductController';
import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ensureShopkeeper from '../middlewares/ensureShopkeeper';

const productsRoutes = Router();

const createProductController = new CreateProductController();

productsRoutes.post(
  '/',
  ensureAuthenticated,
  ensureShopkeeper,
  createProductController.handle,
);

export default productsRoutes;
