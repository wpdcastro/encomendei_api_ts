import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateCategoryStoresUseCase } from './CreateCategoryStoresUseCase';

class CreateCategoryStoresController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.store;
    const { storeCategories_id } = request.body;

    const createCategoryStoresUseCase = container.resolve(
      CreateCategoryStoresUseCase,
    );

    const store = await createCategoryStoresUseCase.execute({
      store_id: id,
      storeCategories_id,
    });

    return response.status(201).json(store);
  }
}

export { CreateCategoryStoresController };
