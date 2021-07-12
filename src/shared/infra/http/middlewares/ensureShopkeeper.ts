import UsersRepository from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { StoresRepository } from '@modules/stores/infra/typeorm/repositories/StoresRepository';
import { NextFunction, Request, Response } from 'express';

import AppError from '@shared/errors/AppError';

export default async function ensureShopkeeper(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = request.user;

  const usersRepository = new UsersRepository();
  const user = await usersRepository.findById(id);

  if (!user.isShopkeeper) {
    throw new AppError('User is not shopkeeper');
  }

  const storesRepository = new StoresRepository();
  const store = await storesRepository.findByUserId(id);

  if (!store) {
    throw new AppError('Store does not exists');
  }

  request.store = { id: store.id };

  return next();
}
