import { IUser } from '@src/models/UserRepo';
import Db from '@src/repos/SQLiteORM';

/**
 * Get one user.
 */
async function getOne(email: string): Promise<IUser | null> {
  return new Promise<IUser | null>((resovle) => {
    Db.connPool.all(`SELECT * FROM "User" WHERE email=?`, [email], (_, rows: IUser[]) => {
      resovle((rows && rows.length) ? rows[0] : null);
    })
  })
}

/**
 * Get all users.
 */
async function getAll(): Promise<IUser[]> {
  return new Promise<IUser[]>((resovle) => {
    Db.connPool.all(`SELECT * FROM "User" WHERE 1;`, (_, rows: IUser[]) => {
      resovle(rows || [])
    })
  })
}

/**
 * Add one user.
 */
async function add(user: IUser): Promise<void> {
  return new Promise<void>((resovle) => {
    const pwdHash = '$2b$12$1mE2OI9hMS/rgH9Mi0s85OM2V5gzm7aF3gJIWH1y0S1MqVBueyjsy'; // default password is: Password@1
    Db.connPool.run(`INSERT INTO "User" ("email", "name", "pwdHash", "role") VALUES (?, ?, ?, ?)`, [
      user.email, user.name, pwdHash, 0
    ], () => resovle())
  })
}

/**
 * Update a user.
 */
async function update(user: IUser): Promise<void> {
  return new Promise<void>((resovle) => {
    Db.connPool.run(`UPDATE "User" SET "name"=?, "pwdHash"=?, "role"=? WHERE id=?`,
      [user.name, user.pwdHash, user.role, user.id]);
    resovle();
  })
}

/**
 * Delete one user.
 */
async function delete_(id: number): Promise<void> {
  return new Promise<void>((resovle) => {
    Db.connPool.run(`DELETE FROM "User" WHERE id=?`, [id]);
    resovle();
  })
}


// **** Export default **** //

export default {
  getOne,
  getAll,
  add,
  update,
  delete: delete_,
} as const;
