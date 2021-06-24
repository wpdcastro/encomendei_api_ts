import auth from '@config/auth';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm/index';

let connection: Connection;
describe('show user profile', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to show user profile', async () => {
    const userCpf = cpfValidator.generate();

    await request(app).post('/users').send({
      name: 'Charlie Fuller',
      email: 'jel@wo.ms',
      cpf: userCpf,
      password: '123s34gf',
      isShopkeeper: false,
    });

    const responseToken = await request(app).post('/sessions').send({
      email: 'jel@wo.ms',
      password: '123s34gf',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get('/users/profile')
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('cpf');
    expect(response.body).toHaveProperty('email');
  });

  it('should not be able to show user profile with valid id user', async () => {
    const { secret_token, expires_in_token } = auth;
    const idUserInexistent = uuidV4();

    const token = sign({}, secret_token, {
      subject: idUserInexistent,
      expiresIn: expires_in_token,
    });

    const response = await request(app)
      .get('/users/profile')
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.clientError).toBe(true);
    expect(response.body).toEqual({ message: 'User does not exists' });
  });
});
