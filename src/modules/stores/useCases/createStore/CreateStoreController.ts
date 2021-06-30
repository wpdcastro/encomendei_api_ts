import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStoreUseCase } from './CreateStoreUseCase';

class CreateStoreController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;

    const { name, description, cnpj, phone, isDelivery } = request.body;

    const createStoreUseCase = container.resolve(CreateStoreUseCase);

    const store = await createStoreUseCase.execute({
      user_id,
      name,
      description,
      cnpj,
      phone,
      isDelivery,
    });

    return response.status(201).json(store);
  }
}

export { CreateStoreController };
