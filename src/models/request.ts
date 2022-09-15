import * as Knex from 'knex';

export class RequestModel {

  saveRequest(db: Knex, data: any) {
    const sql = db.raw(`
    insert into domain (domain,valid,valid_from,valid_to,valid_for) value (?,?,?,?,?) on duplicate key update 
    valid=?,valid_from=?,valid_to=?,valid_for=?,updated_date=now()`,
      [data.domain, data.valid, data.valid_from, data.valid_to, data.valid_for,
      data.valid, data.valid_from, data.valid_to, data.valid_for])
    return sql;
  }

  getData(db: Knex) {
    return db('domain')
      .orderBy('updated_date', 'desc')
      .limit(50);
  }

  update(db: Knex, id, data) {
    return db('domain')
      .where('id', id)
      .update(data)
  }

}