// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an ' +
  'object with the appropriate user keys.';

export enum UserRoles {
  Painter = 0,
  Marketing = 1,
  Admin = 999,
}


// **** Types **** //

export interface IUser {
  id: number;
  email: string;
  name: string;
  job: string;
  pwdHash: string;
  role: UserRoles;
  disabled: number;
}

export interface ISessionUser {
  id: number;
  email: string;
  name: string;
  role: IUser['role'];
}


// **** Functions **** //

/**
 * Create new User.
 */
function new_(
  name?: string,
  email?: string,
  job?: string,
  role?: UserRoles,
  disabled?: number,
  pwdHash?: string,
  id?: number, // id last cause usually set by db
): IUser {
  return {
    id: (id ?? -1),
    name: (name ?? ''),
    email: (email ?? ''),
    job: (job ?? ''),
    role: (role ?? UserRoles.Painter),
    disabled: (disabled ?? 0),
    pwdHash: (pwdHash ?? ''),
  };
}

/**
 * Get user instance from object.
 */
function from(param: object): IUser {
  // Check is user
  if (!isUser(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  // Get user instance
  const p = param as IUser;
  return new_(p.name, p.email, p.job, p.role, p.disabled, p.pwdHash, p.id);
}

/**
 * See if the param meets criteria to be a user.
 */
function isUser(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'id' in arg &&
    'email' in arg &&
    'name' in arg &&
    'job' in arg &&
    'role' in arg &&
    'disabled' in arg
  );
}


// **** Export default **** //

export default {
  new: new_,
  from,
  isUser,
} as const;
