import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SendConfirmationUserMailUseCase } from './SendConfirmationUserMailUseCase';

class SendConfirmationUserMailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const sendConfirmationMailUserUseCase = container.resolve(
      SendConfirmationUserMailUseCase,
    );

    await sendConfirmationMailUserUseCase.execute(id);

    return response.send();
  }
}

export { SendConfirmationUserMailController };
