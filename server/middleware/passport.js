import passport from 'passport';
import local from 'passport-local';
import passportJWT from 'passport-jwt';
import User from '../src/users/userModel';

const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = local.Strategy;
const JWTStrategy = passportJWT.Strategy;

const localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, cb) => {
  try {
    const user = await User.findOne({
      email,
    }).exec();
    if (!user) return cb('userNotFound');
    return await user.authenticate(password, (err, u) => {
      if (err) return cb(err);
      if (!user) return cb('incorrectAccess.');
      return cb(null, u);
    });
  } catch (err) {
    return cb('Incorrect access detected.');
  }
});
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromHeader('auth');
jwtOptions.secretOrKey = process.env.JWT_SECRET;

const loginJWT = new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const user = await User.findById(jwtPayload._id)
      .exec();
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
});

passport.use(localStrategy);
passport.use(loginJWT);
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser(async (_id, cb) => {
  try {
    if (!_id) return cb(null, {});
    const userFound = await User.findById({
      _id,
    }).select('_id email').exec();
    return cb(null, userFound);
  } catch (e) {
    const { name } = e;
    return cb(name);
  }
});
