import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import router from './src/routes';
import { notFound } from './handler/errors';
import './config/enviroments';
import './db/config';
import './middleware/passport';

dotenv.config();

const app = express().use(bodyParser.json());

app.use(express.json());
app.use(passport.initialize());
app.use(`/${process.env.VERSION}`, router);
app.get('*', notFound)
  .post('*', notFound)
  .patch('*', notFound)
  .delete('*', notFound);
app.listen(process.env.PORT, async () => {
  // eslint-disable-next-line no-console
  console.log(`${process.env.PROJECT_NAME} ${process.env.VERSION} Listening ${process.env.PORT}`);
});
