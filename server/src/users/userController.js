import passport from 'passport';
import randtoken from 'rand-token';
import { Exception, codeGenerate } from '../../handler/errors';
import User from './userModel';
import Balance from '../balance/balanceModel';

const signup = async (req, res, next) => {
  const { password, email, confirm } = req.body;
  const regexW = /^(?=.*[-+_!@#$%^&*.,?])/;
  if (!regexW.test(password)) throw new Exception('At least one special character', 'specialCharacter');
  if (password !== confirm) throw new Exception('Password and confirm password does not match', 'confirm');
  const rand = randtoken.generator();
  const balance = new Balance();
  const text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  const user = new User({
    email,
    transactionKey: rand.generate(16, text),
    _balance: balance._id,
  });
  try {
    await User.register(user, password);
    await balance.save();
    return next();
  } catch (e) {
    const { name, message } = e;
    await balance.delete();
    throw new Exception(name || 'validationError', message);
  }
};
const account = async (req, res) => {
  const { user } = req;
  const balance = await user.getBalance();
  return res.status(200).send({ user: balance });
};
const login = async (req, res, next) => {
  await passport.authenticate('local', { session: false }, async (err, user) => {
    try {
      if (err || !user) throw new Exception('authenticationFail', err);
      const { token } = await user.generateAuthToken();
      if (!token) throw new Exception('missingToken');
      res.append('auth', token);
      req.user = user;
      return next();
    } catch (e) {
      const { message } = e;
      res.status(400).send(codeGenerate(message));
    }
  })(req, res, next);
};

export {
  signup,
  account,
  login,
};
