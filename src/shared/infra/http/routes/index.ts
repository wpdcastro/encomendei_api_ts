import { Router } from 'express';

import authenticateRoutes from './authenticate.routes';
import usersRouter from './users.routes';

const router = Router();

router.use('/users', usersRouter);
router.use(authenticateRoutes);

export default router;
