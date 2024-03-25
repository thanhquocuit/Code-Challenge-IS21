import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import SessionUtil from '@src/util/SessionUtil';

import { RouteError } from '@src/other/classes';
import UserRepo from '@src/repos/UserRepo';
import PwdUtil from '@src/util/PwdUtil';
import { tick } from '@src/util/misc';
import { IReq, IRes } from './types/express/misc';


const Errors = {
  Unauth: 'Unauthorized',
  EmailNotFound(email: string) {
    return `User with email "${email}" not found`;
  },
} as const;

interface ILoginReq {
  email: string;
  password: string;
}


// **** Functions **** //

/**
 * Login a user.
 */
async function login(req: IReq<ILoginReq>, res: IRes) {
  const { email, password } = req.body;

  // Fetch user
  const user = await UserRepo.getOne(email);
  if (!user) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      Errors.EmailNotFound(email),
    );
  }

  // Check password
  const hash = (user.pwdHash ?? ''),
    pwdPassed = await PwdUtil.compare(password, hash);
  if (!pwdPassed) {
    // If password failed, wait 500ms this will increase security
    await tick(500);
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      Errors.Unauth,
    );
  }

  // Setup Admin Cookie
  const session = {
    id: user.id,
    email: user.name,
    name: user.name,
    role: user.role,
  }
  await SessionUtil.addSessionData(res, session);

  // Return
  return res.status(HttpStatusCodes.OK).json(session);
}

/**
 * Logout the user.
 */
function logout(_: IReq, res: IRes) {
  SessionUtil.clearCookie(res);
  return res.status(HttpStatusCodes.OK).end();
}


// **** Export default **** //

export default {
  login,
  logout,
} as const;
