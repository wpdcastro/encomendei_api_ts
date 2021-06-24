import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm/index';

let connection: Connection;

describe('Authenticate an user', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to authenticate an user', async () => {
    const userCpf = cpfValidator.generate();

    await request(app).post('/users').send({
      name: 'Francis Fletcher',
      email: 'waveov@va.ee',
      cpf: userCpf,
      password: '12334gf',
      isShopkeeper: false,
    });

    const response = await request(app).post('/sessions').send({
      email: 'waveov@va.ee',
      password: '12334gf',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('refresh_token');
  });

  it('should not be able to authenticate a non existent user', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'invalid@email.com',
      password: 'password',
    });

    expect(response.status).toBe(400);
    expect(response.clientError).toBe(true);
    expect(response.body).toEqual({ message: 'Email or password incorrect' });
  });

  it('should not be able to authenticate a incorrect password', async () => {
    const userCpf = cpfValidator.generate();

    await request(app).post('/users').send({
      name: 'Darrell Ingram',
      email: 'podli@pa.ad',
      cpf: userCpf,
      password: '12334gf',
      isShopkeeper: false,
    });

    const response = await request(app).post('/sessions').send({
      email: 'podli@pa.ad',
      password: 'invalidPassword',
    });

    expect(response.status).toBe(400);
    expect(response.clientError).toBe(true);
    expect(response.body).toEqual({ message: 'Email or password incorrect' });
  });
});
