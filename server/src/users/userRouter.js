import express from 'express';
import { catchErrors } from '../../handler/errors';
import { signup, account, login } from './userController';

const userRouter = express.Router();

userRouter.post('/sign-up', catchErrors(signup), catchErrors(account));
userRouter.post('/login', catchErrors(login), catchErrors(account));

module.exports = userRouter;
