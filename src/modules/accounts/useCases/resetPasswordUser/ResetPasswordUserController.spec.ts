import { hash } from 'bcrypt';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm/index';

let connection: Connection;
let token: string;
let userId: string;
let tokenExpiredDate: string;

describe('reset the user password', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    userId = uuidV4();

    const userCPF = cpfValidator.generate();

    const password = await hash('confirm', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, "confirmedEmail", cpf, password, "isAdmin", "isShopkeeper" ,created_at, updated_at)
        values('${userId}', 'user', 'user@encomendei.com.br', false, '${userCPF}', '${password}', false, false,'now()', 'now()')
      `,
    );

    const idTokenToConfirm = uuidV4();

    token = uuidV4();

    await connection.query(
      `INSERT INTO USERS_TOKENS(id, refresh_token, user_id, expires_date, created_at)
        values('${idTokenToConfirm}', '${token}', '${userId}', '2021-06-26', 'now()')
      `,
    );

    tokenExpiredDate = uuidV4();

    const idToken2 = uuidV4();

    await connection.query(
      `INSERT INTO USERS_TOKENS(id, refresh_token, user_id, expires_date, created_at)
        values('${idToken2}', '${tokenExpiredDate}', '${userId}', '2021-06-18', 'now()')
      `,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to reset user password with token', async () => {
    const response = await request(app)
      .post(`/password/reset?token=${token}`)
      .send({ password: 'newPassword' });

    expect(response.status).toBe(200);
  });

  it('should not be able to reset user password with invalid token', async () => {
    const invalidToken = uuidV4();

    const response = await request(app)
      .post(`/password/reset?token=${invalidToken}`)
      .send({ password: 'newPassword' });

    expect(response.status).toBe(400);
    expect(response.clientError).toBe(true);
    expect(response.body).toEqual({ message: 'token invalid' });
  });

  it('should not be able to reset user password with token expired', async () => {
    const response = await request(app)
      .post(`/password/reset?token=${tokenExpiredDate}`)
      .send({ password: 'newPassword' });

    expect(response.status).toBe(400);
    expect(response.clientError).toBe(true);
    expect(response.body).toEqual({ message: 'token expired' });
  });
});
