import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStoreCategoryUseCase } from './CreateStoreCategoryUseCase';

class CreateStoreCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, color } = request.body;

    const createStoreCategoryUseCase = container.resolve(
      CreateStoreCategoryUseCase,
    );

    const storeCategory = await createStoreCategoryUseCase.execute(name, color);

    return response.status(201).json(storeCategory);
  }
}

export { CreateStoreCategoryController };
