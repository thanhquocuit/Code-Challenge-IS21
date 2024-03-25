import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import UserRepo from '@src/repos/UserRepo';
import { IUser } from '@src/models/UserRepo';
import { IReq, IRes } from './types/express/misc';
import { RouteError } from '@src/other/classes';


export const USER_NOT_FOUND_ERR = 'User not found';

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const users = await UserRepo.getAll();
  return res.status(HttpStatusCodes.OK).json({ users });
}

/**
 * Add one user.
 */
async function add(req: IReq<{ user: IUser }>, res: IRes) {
  const { user } = req.body;

  // check email existing
  const existings = await UserRepo.getOne(user.email);
  if (existings) {
    return res.status(HttpStatusCodes.OK).json({ error: 'User has been existing' });
  }

  // add new user
  await UserRepo.add(user);

  // retreive new data
  const users = await UserRepo.getAll();
  return res.status(HttpStatusCodes.CREATED).json({ users });
}

/**
 * Update one user.
 */
async function update(req: IReq<{ user: IUser }>, res: IRes) {
  const { user } = req.body;
  const existings = await UserRepo.getOne(user.email);
  if (!existings) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  await UserRepo.update(user);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one user.
 */
async function delete_(req: IReq, res: IRes) {
  const id = +req.params.id;
  await UserRepo.delete(id);
  return res.status(HttpStatusCodes.OK).end();
}


// **** Export default **** //

export default {
  getAll,
  add,
  update,
  delete: delete_,
} as const;
