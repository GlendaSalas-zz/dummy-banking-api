import { Exception } from '../../handler/errors';
import Balance from './balanceModel';

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

export {
  addMoney,
};
