/**
 * Middleware to verify user logged in and is an an admin.
 */

import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import SessionUtil from '@src/util/SessionUtil';
import { ISessionUser, UserRoles } from '@src/models/UserRepo';


// **** Types **** //

type TSessionData = ISessionUser & JwtPayload;

// **** Functions **** //

function currentSession(req: Request, res: Response) {
  return new Promise<any>((rs) => {
    // Get session data
    let sessionData = {} as any
    let isLogin = false;

    SessionUtil.getSessionData<TSessionData>(req)
      .then((session) => {
        sessionData = session
        delete sessionData.iat;
        delete sessionData.exp;

        isLogin = true;
      })
      .catch(() => {
        isLogin = false;
      })
      .finally(() => {
        rs(res.json({ isLogin, sessionData }))
      })
  })
}

/**
 * Verify user logged in
 */
async function userMw(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Get session data
  const sessionData = await SessionUtil.getSessionData<TSessionData>(req);
  // Set session data to locals
  if (typeof sessionData === 'object') {
    res.locals.sessionUser = sessionData;
    return next();
  }
  // Return an unauth error if user is not an admin
  else return res
    .status(HttpStatusCodes.UNAUTHORIZED)
    .json({ error: "User is not logged in" });

}

/**
 * Verify user logged in and is an an admin.
 */
async function adminMw(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Get session data
  const sessionData = await SessionUtil.getSessionData<TSessionData>(req);
  // Set session data to locals
  if (
    typeof sessionData === 'object' &&
    sessionData?.role === UserRoles.Admin
  ) {
    res.locals.sessionUser = sessionData;
    return next();
    // Return an unauth error if user is not an admin
  } else {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: 'User not authorized to perform this action' });
  }
}


// **** Export Default **** //

export default { currentSession, adminMw, userMw } as const;
