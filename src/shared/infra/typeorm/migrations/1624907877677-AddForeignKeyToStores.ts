import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class AddForeignKeyToStores1624907877677
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'stores',
      new TableForeignKey({
        name: 'FKStoreUser',
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        columnNames: ['user_id'],
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'stores',
      new TableForeignKey({
        name: 'FKStoreAddress',
        referencedTableName: 'addresses',
        referencedColumnNames: ['id'],
        columnNames: ['address_id'],
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('stores', 'FKStoreAddress');
    await queryRunner.dropForeignKey('stores', 'FKStoreUser');
  }
}
