import CreateUserController from '@modules/accounts/useCases/createUser/CreateUserController';
import { DeleteUserController } from '@modules/accounts/useCases/deleteUser/DeleteUserController';
import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAtuthenticated';

const usersRouter = Router();

const createUserController = new CreateUserController();
const deleteUserController = new DeleteUserController();

usersRouter.post('/', createUserController.handle);

usersRouter.delete('/delete', ensureAuthenticated, deleteUserController.handle);

export default usersRouter;
