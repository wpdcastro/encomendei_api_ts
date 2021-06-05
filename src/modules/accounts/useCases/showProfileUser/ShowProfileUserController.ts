import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ShowProfileUserUseCase } from './ShowProfileUserUseCase';

class ShowProfileUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const showProfileUserUseCase = container.resolve(ShowProfileUserUseCase);

    const user = await showProfileUserUseCase.execute(id);

    return response.json(user);
  }
}

export { ShowProfileUserController };
