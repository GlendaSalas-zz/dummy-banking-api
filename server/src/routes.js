import express from 'express';
import { notFound } from '../handler/errors';
import userRouter from './users/userRouter';

const router = express.Router();

router.use('/user', userRouter);
router.get('/', (req, res) => res.status(200).send(
  {
    name: process.env.PROJECT_NAME,
    version: process.env.VERSION,
  },
));
router.get('*', notFound)
  .post('*', notFound)
  .patch('*', notFound)
  .delete('*', notFound);

module.exports = router;
