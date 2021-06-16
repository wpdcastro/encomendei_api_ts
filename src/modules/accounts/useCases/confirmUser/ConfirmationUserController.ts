import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ConfirmationUserUseCase } from './ConfirmationUserUseCase';

class ConfirmationUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;

    const confirmationUserUseCase = container.resolve(ConfirmationUserUseCase);

    await confirmationUserUseCase.execute(String(token));

    return response.send();
  }
}

export { ConfirmationUserController };
