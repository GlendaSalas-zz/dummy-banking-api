import chai from 'chai';
import chaiHttp from 'chai-http';
import assert from 'assert';
import User from '../server/src/users/userModel';
import app from '../server/app';

chai.should();
chai.use(chaiHttp);
const {
  expect,
} = chai;
let token1;
let token2;
let transactionKey1;
let transactionKey2;
const deposit = 2000;
let transfer = 500;

describe('Balance...', () => {
  before(async () => {
    try {
      const userOne = await User.findOne({ email: process.env.TESTING_USER });
      transactionKey1 = userOne.transactionKey;
      let token = await userOne.generateAuthToken();
      token1 = token.token;
      const userTwo = await User.findOne({ email: process.env.TESTING_USER.replace(/@/i, '1@') });
      transactionKey2 = userTwo.transactionKey;
      token = await userTwo.generateAuthToken();
      token2 = token.token;
      token1.should.be.a('string');
      token2.should.be.a('string');
      assert.ok(true);
    } catch (e) {
      assert.ok(false);
    }
  });
  it(`POST /${process.env.VERSION}/user/balance/deposit [200] User1`, (done) => {
    chai
      .request(app)
      .post(`/${process.env.VERSION}/user/balance/deposit`)
      .send({
        money: deposit,
      })
      .set('auth', token1)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        const { user } = res.body;
        user.should.have.property('email');
        user.should.have.property('_balance');
        const { _balance } = user;
        _balance.should.have.property('money');
        expect(_balance.money).to.equal(deposit);
        done();
      });
  });
  it(`POST /${process.env.VERSION}/user/balance/transfer [200] User1 to User2`, (done) => {
    transfer = deposit - 500;
    chai
      .request(app)
      .post(`/${process.env.VERSION}/user/balance/transfer`)
      .send({
        amount: transfer,
        receiver: transactionKey2,
      })
      .set('auth', token1)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        const { user } = res.body;
        user.should.have.property('email');
        user.should.have.property('_balance');
        const { _balance } = user;
        _balance.should.have.property('money');
        expect(_balance.money).to.equal(deposit - transfer);
        done();
      });
  });
  it(`GET /${process.env.VERSION}/user/balance [200] User2`, (done) => {
    transfer = deposit - 500;
    chai
      .request(app)
      .get(`/${process.env.VERSION}/user/balance`)
      .set('auth', token2)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        const { user } = res.body;
        user.should.have.property('email');
        user.should.have.property('_balance');
        const { _balance } = user;
        _balance.should.have.property('money');
        expect(_balance.money).to.equal(transfer);
        done();
      });
  });
  it(`POST /${process.env.VERSION}/user/balance/transfer [200] User2 to User1`, (done) => {
    chai
      .request(app)
      .post(`/${process.env.VERSION}/user/balance/transfer`)
      .send({
        amount: transfer,
        receiver: transactionKey1,
      })
      .set('auth', token2)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        const { user } = res.body;
        user.should.have.property('email');
        user.should.have.property('_balance');
        const { _balance } = user;
        _balance.should.have.property('money');
        expect(_balance.money).to.equal(0);
        done();
      });
  });
  it(`GET /${process.env.VERSION}/user/balance [200] User1`, (done) => {
    chai
      .request(app)
      .get(`/${process.env.VERSION}/user/balance`)
      .set('auth', token1)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        const { user } = res.body;
        user.should.have.property('email');
        user.should.have.property('_balance');
        const { _balance } = user;
        _balance.should.have.property('money');
        expect(_balance.money).to.equal(deposit);
        done();
      });
  });
});
