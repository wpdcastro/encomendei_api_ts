import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateProductUseCase } from './CreateProductUseCase';

class CreateProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: store_id } = request.store;

    const { name, description, price, isActive, id } = request.body;

    const createProductUseCase = container.resolve(CreateProductUseCase);

    const product = await createProductUseCase.execute({
      name,
      description,
      price,
      isActive,
      store_id,
      id,
    });

    return response.json(product);
  }
}

export { CreateProductController };
