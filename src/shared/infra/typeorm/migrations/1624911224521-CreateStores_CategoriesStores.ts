import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateStoresCategoriesStores1624911224521
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'stores_categories_stores',
        columns: [
          {
            name: 'store_id',
            type: 'uuid',
          },
          {
            name: 'store_category_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'stores_categories_stores',
      new TableForeignKey({
        name: 'FKStoreCategories_Stores',
        referencedTableName: 'stores',
        referencedColumnNames: ['id'],
        columnNames: ['store_id'],
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'stores_categories_stores',
      new TableForeignKey({
        name: 'FKCategories_StoresStore',
        referencedTableName: 'stores_categories',
        referencedColumnNames: ['id'],
        columnNames: ['store_category_id'],
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'stores_categories_stores',
      'FKCategories_StoresStore',
    );

    await queryRunner.dropForeignKey(
      'stores_categories_stores',
      'FKStoreCategories_Stores',
    );

    await queryRunner.dropTable('stores_categories_stores');
  }
}
