/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    await knex("spreadsheets")
        .insert([{ spreadsheet_id: "1qNtpoQ3zeyUfFTKmJn1SujCs_mgkFAhFFTxSNn32XdM" }])
        .onConflict(["spreadsheet_id"])
        .ignore();
}


/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<any[]>}
 */
export async function getAllGSheets(knex) {
    return await knex("spreadsheets")
        .select("spreadsheet_id")
        .returning("spreadsheet_id");
}