import auth from '@config/auth';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { EtherealMailProvider } from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm/index';

let connection: Connection;

describe('send email of confirmation user', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to sending email of user confirmation', async () => {
    const sendMail = jest.spyOn(EtherealMailProvider.prototype, 'sendMail');

    const userCpf = cpfValidator.generate();

    await request(app).post('/users').send({
      name: 'Genevieve Franklin',
      email: 'wufu@humheg.cy',
      cpf: userCpf,
      password: '123s34gfs',
      isShopkeeper: false,
    });

    const responseToken = await request(app).post('/sessions').send({
      email: 'wufu@humheg.cy',
      password: '123s34gfs',
    });

    const { token } = responseToken.body;

    await request(app)
      .post('/users/sendConfirmationMail')
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(sendMail).toHaveBeenCalled();
  }, 60000);

  it('should not be able to send email of confirmation with id user invalid', async () => {
    const { secret_token, expires_in_token } = auth;
    const idUserInexistent = uuidV4();

    const token = sign({}, secret_token, {
      subject: idUserInexistent,
      expiresIn: expires_in_token,
    });

    const response = await request(app)
      .post('/users/sendConfirmationMail')
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.clientError).toBe(true);
    expect(response.body).toEqual({
      message: 'User Does not exists',
    });
  });
});
