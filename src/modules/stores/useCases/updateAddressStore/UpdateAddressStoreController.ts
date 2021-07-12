import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateStoreAddressStoreUseCase } from './UpdateAddressStoreUseCase';

class UpdateStoreAddressStoreController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: store_id } = request.store;

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
    } = request.body;

    const updatedStoreAddressStoreUseCase = container.resolve(
      UpdateStoreAddressStoreUseCase,
    );

    const updatedAddress = await updatedStoreAddressStoreUseCase.execute({
      store_id,
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
    });

    return response.json(updatedAddress).send();
  }
}

export { UpdateStoreAddressStoreController };
