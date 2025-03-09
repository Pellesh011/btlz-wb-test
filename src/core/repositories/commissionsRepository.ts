import { IDbСommission, ICommissionsRepository } from "#core/types/commission.js";
import { Knex } from "knex";

export class CommissionsRepository implements ICommissionsRepository {
  private knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getAll(): Promise<IDbСommission[]> {
    return this.knex<IDbСommission>('commissions').select('*');
  }

  async create(commision: IDbСommission): Promise<void> {
    await this.knex<IDbСommission>('commissions').insert(commision);
  }

  async butchCreateOrUpdate(commisions: IDbСommission[], batchSize: number = 1000): Promise<void> {
    for (let i = 0; i < commisions.length; i += batchSize) {
      const batch = commisions.slice(i, i + batchSize);
      await this.knex<IDbСommission>('commissions')
        .insert(batch)
        .onConflict(['subject_id', 'timestamp'])
        .merge();

    }
  }

  async createOrUpdate(commision: IDbСommission): Promise<void> {
    await this.knex<IDbСommission>('commissions').insert(commision).onConflict(['subject_id', 'timestamp']).merge();
  }

  async getById(id: number): Promise<IDbСommission | undefined> {
    return this.knex<IDbСommission>('commissions').where('subject_id', id).first();
  }

  async update(id: number, report: Partial<IDbСommission>): Promise<void> {
    await this.knex<IDbСommission>('commissions').where('subject_id', id).update(report);
  }

  async delete(id: number): Promise<void> {
    await this.knex<IDbСommission>('commissions').where('subject_id', id).del();
  }
}