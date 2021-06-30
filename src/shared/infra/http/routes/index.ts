import { Router } from 'express';

import authenticateRoutes from './authenticate.routes';
import passwordRoutes from './password.routes';
import storesRoutes from './stores.routes';
import usersRouter from './users.routes';

const router = Router();

router.use('/users', usersRouter);
router.use(authenticateRoutes);
router.use('/password', passwordRoutes);
router.use('/stores', storesRoutes);

export default router;
