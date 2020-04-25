import express from 'express';
import { catchErrors } from '../../handler/errors';
import { account } from '../users/userController';
import { isAuth } from '../../middleware/auth';

const balanceRouter = express.Router();

balanceRouter.get('/', catchErrors(isAuth), catchErrors(account));

module.exports = balanceRouter;
