import express from 'express';
import passport from 'passport';
import cors from 'cors'
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import router from './src/routes';
import { notFound } from './handler/errors';
import './config/enviroments';
import './db/config';
import './middleware/passport';

dotenv.config();

const app = express().use(bodyParser.json());

app.use(cors({ exposedHeaders: ['auth'] }));
app.use(express.json());
app.use(passport.initialize());
app.use(bodyParser.json({ limit: '50000mb' }))
app.use(bodyParser.urlencoded({ limit: '50000mb', extended: true, parameterLimit: 50000 }))
app.use(`/${process.env.VERSION}`, router);
app.get('*', notFound)
  .post('*', notFound)
  .patch('*', notFound)
  .delete('*', notFound);
app.listen(process.env.PORT, async () => {
  // eslint-disable-next-line no-console
  console.log(`${process.env.PROJECT_NAME} ${process.env.VERSION} Listening ${process.env.PORT}`);
});

export default app;
