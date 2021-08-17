import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateProductsCategoriesProducts1629243112052
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products_categories_products',
        columns: [
          {
            name: 'product_id',
            type: 'uuid',
          },
          {
            name: 'product_category_id',
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

    await queryRunner.createForeignKeys('products_categories_products', [
      new TableForeignKey({
        name: 'FKProductCategories_Product',
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        columnNames: ['product_id'],
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
      }),

      new TableForeignKey({
        name: 'FKCategoriesProduct_Product',
        referencedTableName: 'products_categories',
        referencedColumnNames: ['id'],
        columnNames: ['product_category_id'],
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys('products_categories_products', [
      new TableForeignKey({
        name: 'FKProductCategories_Product',
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        columnNames: ['product_id'],
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
      }),

      new TableForeignKey({
        name: 'FKCategoriesProduct_Product',
        referencedTableName: 'products_categories',
        referencedColumnNames: ['id'],
        columnNames: ['product_category_id'],
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
      }),
    ]);

    await queryRunner.dropTable('products_categories_products');
  }
}
