import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm/index';

let connection: Connection;

describe('Create an user', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new user', async () => {
    const userCpf = cpfValidator.generate();

    const response = await request(app).post('/users').send({
      name: 'Fred Nash',
      email: 'huolaep@okkifrac.aw',
      cpf: userCpf,
      password: 'password321',
      isShopkeeper: false,
    });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a new user with cpf different from 11 digits', async () => {
    const response = await request(app).post('/users').send({
      name: 'Alma Waters',
      email: 'ak@vok.to',
      cpf: '1234567891223',
      password: 'password32s1',
      isShopkeeper: false,
    });

    expect(response.status).toBe(400);
    expect(response.clientError).toBe(true);
    expect(response.body).toEqual({
      message: 'Invalid field, must be 11 digits for cpf',
    });
  });

  it('should not be able to create a new user with invalid cpf', async () => {
    const response = await request(app).post('/users').send({
      name: 'Fred Nash',
      email: 'huolaep@okkifrac.aw',
      cpf: '22222222222',
      password: 'password321',
      isShopkeeper: false,
    });

    expect(response.status).toBe(400);
    expect(response.clientError).toBe(true);
    expect(response.body).toEqual({
      message: 'CPF is invalid',
    });
  });

  it('should not be able to create a new user with user existent with cpf', async () => {
    const userCpf = cpfValidator.generate();

    await request(app).post('/users').send({
      name: 'Glen Anderson',
      email: 'mam@lomwis.id',
      cpf: userCpf,
      password: 'password3s2s1',
      isShopkeeper: false,
    });

    const response = await request(app).post('/users').send({
      name: 'Glen Anderson',
      email: 'zohasaceg@zozja.ba',
      cpf: userCpf,
      password: 'password3s2s1',
      isShopkeeper: false,
    });

    expect(response.status).toBe(400);
    expect(response.clientError).toBe(true);
    expect(response.body).toEqual({
      message: 'User Already Exists',
    });
  });

  it('should not be able to create a new user with email registered', async () => {
    const userCpf = cpfValidator.generate();

    await request(app).post('/users').send({
      name: 'Cynthia Harrington',
      email: 'odavi@ranhi.lk',
      cpf: userCpf,
      password: 'password3s2s1',
      isShopkeeper: false,
    });

    const userCpf2 = cpfValidator.generate();

    const response = await request(app).post('/users').send({
      name: 'Cynthia Harrington',
      email: 'odavi@ranhi.lk',
      cpf: userCpf2,
      password: 'password3s2s1',
      isShopkeeper: false,
    });

    expect(response.status).toBe(400);
    expect(response.clientError).toBe(true);
    expect(response.body).toEqual({
      message: 'User Already Exists',
    });
  });
});
