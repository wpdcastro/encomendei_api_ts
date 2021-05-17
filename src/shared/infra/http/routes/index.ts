import { Router } from 'express';

import authenticateRoutes from './authenticate.routes';
import { passwordRoutes } from './password.routes';
import usersRouter from './users.routes';

const router = Router();

router.use('/users', usersRouter);
router.use(authenticateRoutes);
router.use('/password', passwordRoutes);

export default router;
