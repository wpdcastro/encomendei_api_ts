import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateCategoryOnProductsUseCase } from './CreateCategoryOnProductsUseCase';

class CreateCategoryOnProductsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { product_id, productCategories_id } = request.body;

    const createCategoryOnProductsUseCase = container.resolve(
      CreateCategoryOnProductsUseCase,
    );

    const product = await createCategoryOnProductsUseCase.execute({
      product_id,
      productCategories_id,
    });

    return response.status(201).json(product);
  }
}

export { CreateCategoryOnProductsController };
