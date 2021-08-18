import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateProductCategoryUseCase } from './CreateProductCategoryUseCase';

class CreateProductCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, color } = request.body;

    const createProductCategoryUseCase = container.resolve(
      CreateProductCategoryUseCase,
    );

    const productCategory = await createProductCategoryUseCase.execute(
      name,
      color,
    );
    return response.status(201).json(productCategory);
  }
}

export { CreateProductCategoryController };
