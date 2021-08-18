import { CreateCategoryOnProductsController } from '@modules/stores/useCases/createCategoryOnProducts/CreateCategoryOnProductsController';
import { CreateProductCategoryController } from '@modules/stores/useCases/createProductCategories/CreateProductCategoryController';
import { CreateProductController } from '@modules/stores/useCases/createProducts/CreateProductController';
import { Router } from 'express';

import { ensureAdmin } from '../middlewares/ensureAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ensureShopkeeper from '../middlewares/ensureShopkeeper';

const productsRoutes = Router();

const createProductController = new CreateProductController();
const createProductCategoryController = new CreateProductCategoryController();
const createCategoryOnProductsController =
  new CreateCategoryOnProductsController();

productsRoutes.post(
  '/',
  ensureAuthenticated,
  ensureShopkeeper,
  createProductController.handle,
);

productsRoutes.post(
  '/category',
  ensureAuthenticated,
  ensureAdmin,
  createProductCategoryController.handle,
);

productsRoutes.post(
  '/categories',
  ensureAuthenticated,
  ensureShopkeeper,
  createCategoryOnProductsController.handle,
);

export default productsRoutes;
