import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeleteStoreUseCase } from './DeleteStoreUseCase';

class DeleteStoreController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;

    const deleteStoreUseCase = container.resolve(DeleteStoreUseCase);

    await deleteStoreUseCase.execute(user_id);

    return response.send();
  }
}

export { DeleteStoreController };
