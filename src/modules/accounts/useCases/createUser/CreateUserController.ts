import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserUseCase from './CreateUserUseCase';

export default class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, cpf, password, isShopkeeper } = request.body;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    await createUserUseCase.execute({
      name,
      email,
      cpf,
      password,
      isShopkeeper,
    });

    return response.status(201).send();
  }
}
