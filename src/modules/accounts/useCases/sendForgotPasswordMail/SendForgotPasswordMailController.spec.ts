import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import request from 'supertest';
import { Connection } from 'typeorm';

import { EtherealMailProvider } from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm/index';

let connection: Connection;

describe('send forgot password email to user', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to send forgot password mail to user', async () => {
    const sendMail = jest.spyOn(EtherealMailProvider.prototype, 'sendMail');

    const userCpf = cpfValidator.generate();

    await request(app).post('/users').send({
      name: 'Genevieve Franklin',
      email: 'gub@tet.ws',
      cpf: userCpf,
      password: '123s34gfs',
      isShopkeeper: false,
    });

    await request(app).post('/password/forgot').send({
      email: 'gub@tet.ws',
    });

    expect(sendMail).toHaveBeenCalled();
  }, 60000);

  it('should not be able to send reset password mail to email inexistent', async () => {
    const response = await request(app).post('/password/forgot').send({
      email: 'email@inexistent.com',
    });

    expect(response.status).toBe(400);
    expect(response.clientError).toBe(true);
    expect(response.body).toEqual({
      message: 'User does not exists',
    });
  });
});
