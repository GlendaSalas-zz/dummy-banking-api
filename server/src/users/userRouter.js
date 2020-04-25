import express from 'express';
import { catchErrors } from '../../handler/errors';
import { signup, account, login } from './userController';
import balanceRouter from '../balance/balanceRouter';

const userRouter = express.Router();

userRouter.use('/balance', balanceRouter);
userRouter.post('/sign-up', catchErrors(signup), catchErrors(login), catchErrors(account));
userRouter.post('/login', catchErrors(login), catchErrors(account));

module.exports = userRouter;
