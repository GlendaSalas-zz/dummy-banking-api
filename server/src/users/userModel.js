import mongoose from 'mongoose';
import validor from 'validator';
import jwt from 'jsonwebtoken';
import passportLocalMongoose from 'passport-local-mongoose';

const UsersSchema = new mongoose.Schema({
  name: String,
  phone: {
    type: Number,
    required: false,
  },
  email: {
    type: String,
    minlength: 5,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: validor.isEmail,
      message: '{VALUE} no es valido',
    },
  },
});
UsersSchema.methods.generateAuthToken = async function generateAuthToken() {
  const access = 'auth';
  const params = { _id: this._id.toHexString(), access };
  const token = jwt.sign(
    params,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.TIME_EXPIRES,
      algorithm: 'HS256',
    },
  ).toString();
  return { token };
};
UsersSchema.methods.toJSON = function toJson() {
  const user = this;
  const userObject = user.toObject();
  return {
    name: userObject.name,
    email: userObject.email,
  };
};
UsersSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
const User = mongoose.model('users', UsersSchema);
module.exports = User;
