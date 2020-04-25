import mongoose from 'mongoose';
import { Exception } from '../../handler/errors';
import Balance from './balanceModel';
import User from '../users/userModel';

const addMoney = async (req, res, next) => {
  const { _balance, _id } = req.user;
  const { money } = req.body;
  let { user } = req.body;
  if (!user) user = _id;
  if (!money) throw new Exception('moneyIsRequired');
  const n = await Balance.updateOne({
    _id: _balance,
  }, {
    $push: {
      history: {
        money,
        _user: user,
      },
    },
  });
  if (n.n === 1 && n.nModified === 1) {
    return next();
  }
  throw new Exception('authenticationFail');
};
const transfer = async (req, res, next) => {
  const { user } = req;
  const { amount, receiver } = req.body;
  if (!amount) throw new Exception('amountIsRequired');
  if (!receiver && !mongoose.Types.ObjectId.isValid(receiver)) {
    throw new Exception('receiverIsRequired');
  }
  const balance = await user.getBalance();
  const { money } = balance._balance;
  if (amount > money) throw new Exception('insufficientFunds');
  const receiverUser = await User
    .findOne({ _id: receiver })
    .select('_balance');
  if (!receiverUser) throw new Exception('receiverNotFound');
  const giverUser = await Balance.updateOne({
    _id: user._balance,
  }, {
    $push: {
      history: {
        money: -`${amount}`,
        _user: user._id,
      },
    },
  });
  if (giverUser.n === 1 && giverUser.nModified === 1) {
    await Balance.updateOne({
      _id: receiverUser._balance,
    }, {
      $push: {
        history: {
          money: amount,
          _user: user._id,
        },
      },
    });
    return next();
  }
  throw new Exception('transferError');
};
export {
  addMoney,
  transfer,
};
