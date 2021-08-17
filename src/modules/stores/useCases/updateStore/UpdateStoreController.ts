import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateStoreUseCase } from './UpdateStoreUseCase';

class UpdateStoreController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { id: store_id } = request.store;

    const { name, description, cnpj, phone, isDelivery, storeCategories_id } =
      request.body;

    const updateStoreUseCase = container.resolve(UpdateStoreUseCase);

    const store = await updateStoreUseCase.execute({
      store_id,
      user_id,
      name,
      description,
      cnpj,
      phone,
      isDelivery,
      storeCategories_id,
    });

    return response.json(store).send();
  }
}

export { UpdateStoreController };
