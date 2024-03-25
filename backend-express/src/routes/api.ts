import { Router } from 'express';
import jetValidator from 'jet-validator';

import MW from './middleware/adminMw';
import Paths from '../constants/Paths';
import User from '@src/models/UserRepo';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';
import PaintStockRoutes from './PaintStockRoutes';


// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();


// **** Setup AuthRouter **** //

const authRouter = Router();

// Login user
authRouter.post(
  Paths.Auth.Login,
  validate('email', 'password'),
  AuthRoutes.login,
);

// Logout user
authRouter.get(
  Paths.Auth.Logout,
  AuthRoutes.logout,
);

// Add AuthRouter
apiRouter.use(Paths.Auth.Base, authRouter);


// ** Add PaintStockRoutes ** //
const paintStockRouter = Router();

paintStockRouter.get(
  Paths.PaintStock.Get,
  PaintStockRoutes.getAll,
);

paintStockRouter.put(
  Paths.PaintStock.UpdatePaint,
  validate(['data', PaintStockRoutes.isPaintItem]),
  PaintStockRoutes.updatePaint,
);

paintStockRouter.put(
  Paths.PaintStock.UpdateOrder,
  validate(['data', PaintStockRoutes.isOrderItem]),
  PaintStockRoutes.updateOrder,
);

// Add PaintStockRoutes
apiRouter.use(
  Paths.PaintStock.Base,
  MW.userMw, // Require login to access /stock API
  paintStockRouter);

// ** Add UserRouter ** //

const userRouter = Router();

// Get all users
userRouter.get(
  Paths.Users.Get,
  UserRoutes.getAll,
);

// Add one user
userRouter.post(
  Paths.Users.Add,
  validate(['user', User.isUser]),
  UserRoutes.add,
);

// Update one user
userRouter.put(
  Paths.Users.Update,
  validate(['user', User.isUser]),
  UserRoutes.update,
);

// Delete one user
userRouter.delete(
  Paths.Users.Delete,
  validate(['id', 'number', 'params']),
  UserRoutes.delete,
);

// Add UserRouter
apiRouter.use(Paths.Users.Base,
  MW.adminMw,  // Require to be an admin to access /user API
  userRouter);


// Get current session info
apiRouter.get(Paths.Session, MW.currentSession);

// **** Export default **** //

export default apiRouter;
