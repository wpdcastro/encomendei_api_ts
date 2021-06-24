import { ConfirmationUserController } from '@modules/accounts/useCases/confirmUser/ConfirmationUserController';
import CreateUserController from '@modules/accounts/useCases/createUser/CreateUserController';
import { DeleteUserController } from '@modules/accounts/useCases/deleteUser/DeleteUserController';
import { SendConfirmationUserMailController } from '@modules/accounts/useCases/sendConfirmateUserMail/SendConfirmationUserMailController';
import { ShowProfileUserController } from '@modules/accounts/useCases/showProfileUser/ShowProfileUserController';
import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();

const createUserController = new CreateUserController();
const deleteUserController = new DeleteUserController();
const sendConfirmationMailUserController =
  new SendConfirmationUserMailController();
const confirmationUserController = new ConfirmationUserController();
const showProfileUserController = new ShowProfileUserController();

usersRouter.post('/', createUserController.handle);

usersRouter.delete('/delete', ensureAuthenticated, deleteUserController.handle);

usersRouter.post(
  '/sendConfirmationMail',
  ensureAuthenticated,
  sendConfirmationMailUserController.handle,
);

usersRouter.post('/confirmation', confirmationUserController.handle);

usersRouter.get(
  '/profile',
  ensureAuthenticated,
  showProfileUserController.handle,
);

export default usersRouter;
