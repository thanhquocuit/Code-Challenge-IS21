import sqlite3 from 'sqlite3';

const db = {
    connPool: (undefined as any) as sqlite3.Database
}
export function OpenORM() {
    if (db.connPool) return;

    console.log(`SQLite opened`)
    db.connPool = new sqlite3.Database('./database.db');
}

export function CloseORM() {
    if (db.connPool) db.connPool.close();
}

export default db