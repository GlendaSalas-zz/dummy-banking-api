import mongoose from 'mongoose';
import moment from 'moment-timezone';

const BalanceSchema = new mongoose.Schema({
  history: [
    {
      money: {
        type: Number,
        default: 0,
        required: true,
      },
      date: {
        type: Date,
        default: moment().format(),
        required: true,
      },
      _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
    },
  ],
});
BalanceSchema.methods.toJSON = function toJson() {
  const balance = this;
  const balanceObject = balance.toObject();
  return {
    money: balanceObject.money,
  };
};
const Balance = mongoose.model('balances', BalanceSchema);
module.exports = Balance;
