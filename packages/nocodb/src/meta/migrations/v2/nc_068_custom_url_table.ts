import type { Knex } from 'knex';
import { MetaTable } from '~/utils/globals';

const up = async (knex: Knex) => {
  await knex.schema.createTable(MetaTable.CUSTOM_URLS, (table) => {
    table.string('id', 20);

    table.string('fk_workspace_id', 20);

    table.string('base_id', 20);

    table.string('fk_model_id', 20);

    table.string('view_id', 20);

    table.string('original_path');

    table.string('custom_path');

    table.timestamps(true, true);
  });
};

const down = async (knex: Knex) => {
  await knex.schema.dropTable(MetaTable.CUSTOM_URLS);
};

export { up, down };
