import auth from '@config/auth';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm/index';

let connection: Connection;

describe('Generate a new token and refresh token with refresh token', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to generate new token and refresh token', async () => {
    const userCpf = cpfValidator.generate();

    await request(app).post('/users').send({
      name: 'James Ryan',
      email: 'hidsi@wuepore.ck',
      cpf: userCpf,
      password: '12334gfs',
      isShopkeeper: false,
    });

    const responseToken = await request(app).post('/sessions').send({
      email: 'hidsi@wuepore.ck',
      password: '12334gfs',
    });

    const { refresh_token } = responseToken.body;

    const response = await request(app).post('/refresh_token').send({
      token: refresh_token,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('refresh_token');
  });

  it('should not be able to generated others tokens with refresh token invalid', async () => {
    const { secret_refresh_token, expires_in_refresh_token } = auth;

    const userIdInvalid = uuidV4();

    const email = 'evmut@gujanma.pw';

    const tokenInvalid = sign({ email }, secret_refresh_token, {
      subject: userIdInvalid,
      expiresIn: expires_in_refresh_token,
    });

    const response = await request(app).post('/refresh_token').send({
      token: tokenInvalid,
    });

    expect(response.status).toBe(400);
    expect(response.clientError).toBe(true);
    expect(response.body).toEqual({ message: 'Refresh token does not exists' });
  });
});
