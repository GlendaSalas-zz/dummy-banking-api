import mongoose from 'mongoose';
import validor from 'validator';
import jwt from 'jsonwebtoken';
import passportLocalMongoose from 'passport-local-mongoose';

const UsersSchema = new mongoose.Schema({
  name: String,
  transactionKey: {
    type: String,
    maxlength: 16,
    minlength: 16,
    unique: true,
    required: true,
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
  _balance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'balances',
    required: true,
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
UsersSchema.methods.getBalance = async function getBalance() {
  try {
    const user = await this.model('users').aggregate([
      {
        $match: {
          _id: this._id,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
          email: 1,
          _balance: 1,
          transactionKey: 1,
        },
      },
      {
        $lookup: {
          from: 'balances',
          let: {
            id: '$_balance',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$id'],
                },
              },
            },
            {
              $project: {
                history: 1,
              },
            },
            {
              $unwind: {
                path: '$history',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: null,
                money: {
                  $sum: '$history.money',
                },
              },
            },
            {
              $project: {
                _id: 0,
                money: 1,
              },
            },
          ],
          as: '_balance',
        },
      },
      {
        $unwind: '$_balance',
      },
    ]);
    if (!user[0]) return {};
    return user[0];
  } catch (e) {
    return {};
  }
};
UsersSchema.methods.toJSON = function toJson() {
  const user = this;
  const userObject = user.toObject();
  return {
    name: userObject.name,
    email: userObject.email,
    id: userObject._id,
  };
};
UsersSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
const User = mongoose.model('users', UsersSchema);
module.exports = User;
