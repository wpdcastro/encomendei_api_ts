import { hash } from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';

import createConnection from '../index';

async function create() {
  const connection = await createConnection('localhost');

  const id = uuidV4();
  const password = await hash('admin', 8);

  await connection.query(
    `INSERT INTO USERS(id, name, email, "confirmedEmail", cpf, password, "isAdmin", "isShopkeeper", created_at, updated_at)
      values('${id}', 'admin', 'admin@encomendei.com.br', true, 'cpfAdmin', '${password}', true, true, 'now()', 'now()')
    `,
  );

  await connection.close();
}

create().then(() => console.log('User Admin created'));
