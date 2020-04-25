import express from 'express';
import { catchErrors } from '../../handler/errors';
import { account } from '../users/userController';
import { addMoney } from './balanceController';
import { isAuth } from '../../middleware/auth';

const balanceRouter = express.Router();

balanceRouter.get('/', catchErrors(isAuth), catchErrors(account));
balanceRouter.post('/deposit', catchErrors(isAuth), catchErrors(addMoney), catchErrors(account));

module.exports = balanceRouter;
