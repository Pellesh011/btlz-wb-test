/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable('commissions', (table) => {
        table.decimal('kgvp_marketplace', 10, 2).notNullable();
        table.decimal('kgvp_supplier', 10, 2).notNullable();
        table.decimal('kgvp_supplier_express', 10, 2).notNullable();
        table.decimal('paid_storage_kgvp', 10, 2).notNullable();
        table.integer('parent_id').notNullable();
        table.string('parent_name').notNullable();
        table.integer('subject_id').notNullable();
        table.string('subject_name').notNullable();
        table.bigInteger('timestamp').notNullable();
        table.unique(["subject_id", "timestamp"]);
    });
}
/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    knex.schema.alterTable("commissions", (table) => {
        table.dropUnique(["subject_id", "timestamp"]);
    });
    return knex.schema.dropTable('commissions');
}
