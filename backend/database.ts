import {
    PoolConfig,
    Pool,
    createPool,
    QueryFunction,
    MysqlError
  } from 'mysql';
import * as fs from 'fs';
  
var dbConfig = {
    connectionLimit: 20,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    timezone: 'utc',
    ssl: {
        ca: fs.readFileSync(process.env.SERVER_CA),
        key: fs.readFileSync(process.env.CLIENT_KEY),
        cert: fs.readFileSync(process.env.CLIENT_CERT)
    },
    charset : 'utf8mb4'
};

/**
 * Use JSON as opposed to flat arrays to bind to SQL statements
 * @param query
 * @param values
 * @returns {*}
 */
function queryFormat(query, values) {
  if (!values) return query;

  // escape IDs
  query = query.replace(
    /\:\:(\w+)/g,
    function(txt, key) {
      if (values.hasOwnProperty(key)) {
        return this.escapeId(values[key]);
      }
      return txt;
    }.bind(this),
  );

  // escape values
  query = query.replace(
    /\:(\w+)/g,
    function(txt, key) {
      if (values.hasOwnProperty(key)) {
        return this.escape(values[key]);
      } else {
        return 'NULL';
      }
      return txt;
    }.bind(this),
  );

  return query;
}

export class Database {
  public query: QueryFunction;
  public beginTransaction: (callback: (err: MysqlError) => void) => void;
  public commit: (callback: (err: MysqlError) => void) => void;

  private pool: Pool;
  constructor(config: PoolConfig) {
    config.queryFormat = queryFormat;
    this.pool = createPool(config);
  }


  public queryAsync<T>(sql: string, args?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

const db = new Database(dbConfig);

export default db;
  