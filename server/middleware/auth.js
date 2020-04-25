import passport from 'passport';
import { Exception } from '../handler/errors';

const isAuth = async function isAuthenticated(req, res, next) {
  const token = req.get('auth');
  if (!token) throw new Exception('tokenMissing', 401);
  await passport.authenticate('jwt', { session: true, failureFlash: 'Incorrect access detected.' }, (reqe, user, err) => {
    if (err) throw new Exception(err, 401);
    if (!user) throw new Exception({ name: 'accessDenied' }, 401);
    req.user = user;
    return next();
  })(req, res, next);

  return true;
};
export { isAuth };
