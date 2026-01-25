declare module "better-sqlite3" {
  class Database {
    constructor(filename: string, options?: any);
    pragma(pragma: string): any;
    exec(sql: string): void;
    prepare(sql: string): Statement;
    close(): void;
  }

  interface Statement {
    run(...params: any[]): RunResult;
    get(...params: any[]): any;
    all(...params: any[]): any[];
  }

  interface RunResult {
    changes: number;
    lastInsertRowid: number | bigint;
  }

  export default Database;
}
