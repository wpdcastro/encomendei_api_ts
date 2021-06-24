import auth from '@config/auth';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm/index';

let connection: Connection;

describe('delete user account', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to delete an account', async () => {
    const userCpf = cpfValidator.generate();

    await request(app).post('/users').send({
      name: 'Marcus Frazier',
      email: 'hugan@coguvge.ba',
      cpf: userCpf,
      password: 'password3s2s1s',
      isShopkeeper: false,
    });

    const responseToken = await request(app).post('/sessions').send({
      email: 'hugan@coguvge.ba',
      password: 'password3s2s1s',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .delete('/users/delete')
      .send({ password: 'password3s2s1s' })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
  });

  it('should not be able to delete user without token', async () => {
    const response = await request(app)
      .delete('/users/delete')
      .send({ password: 'password3s2s1s' });

    expect(response.status).toBe(401);
    expect(response.clientError).toBe(true);
    expect(response.body).toEqual({ message: 'Token missing' });
  });

  it('should not be able to delete an inexistent user', async () => {
    const { secret_token, expires_in_token } = auth;
    const idUserInexistent = uuidV4();

    const token = sign({}, secret_token, {
      subject: idUserInexistent,
      expiresIn: expires_in_token,
    });

    const response = await request(app)
      .delete('/users/delete')
      .send({ password: 'password3s2s1s' })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.clientError).toBe(true);
    expect(response.body).toEqual({ message: 'User does not exists' });
  });

  it('should not be able to delete an user with incorrect password', async () => {
    const userCpf = cpfValidator.generate();

    await request(app).post('/users').send({
      name: 'Charlie Francis',
      email: 'elib@falijfe.py',
      cpf: userCpf,
      password: 'passwords3s2s1s',
      isShopkeeper: false,
    });

    const responseToken = await request(app).post('/sessions').send({
      email: 'elib@falijfe.py',
      password: 'passwords3s2s1s',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .delete('/users/delete')
      .send({ password: 'incorrectPassword' })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.clientError).toBe(true);
    expect(response.body).toEqual({ message: 'Password is incorrect' });
  });
});
