import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStoreAddressUseCase } from './CreateStoreAddressUseCase';

class CreateStoreAddressController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      name,
      state,
      city,
      district,
      street,
      number,
      cep,
      apartment_number,
      type_address,
      phone,
      additional_indications,
      store_id,
    } = request.body;

    const createStoreAddressUseCase = container.resolve(
      CreateStoreAddressUseCase,
    );

    const address = await createStoreAddressUseCase.execute({
      name,
      state,
      city,
      district,
      street,
      number,
      cep,
      apartment_number,
      type_address,
      phone,
      additional_indications,
      store_id,
    });

    return response.status(201).json(address);
  }
}

export { CreateStoreAddressController };
