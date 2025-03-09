
import { ISpreadsheets, ISpreadsheetsRepository } from "#core/types/spreadsheets.js";
import { Knex } from "knex";

export class SpreadsheetsRepository implements ISpreadsheetsRepository {
  private knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getAll(): Promise<ISpreadsheets[]> {
    return this.knex<ISpreadsheets>('spreadsheets').select('*');
  }

  async create(spreadsheet: ISpreadsheets): Promise<void> {
    await this.knex<ISpreadsheets>('spreadsheets').insert(spreadsheet);
  }
}
