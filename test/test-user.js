import chai from 'chai';
import chaiHttp from 'chai-http';
import assert from 'assert';
import Balance from '../server/src/balance/balanceModel';
import User from '../server/src/users/userModel';
import app from '../server/app';

chai.should();
chai.use(chaiHttp);
const {
  expect,
} = chai;
const userOne = {
  email: process.env.TESTING_USER,
  password: 'Qwerty123!',
  confirm: 'Qwerty123!',
};
const userTwo = {
  email: process.env.TESTING_USER.replace(/@/i, '1@'),
  password: 'Qwerty123!',
  confirm: 'Qwerty123!',
};
describe('User...', () => {
  before(async () => {
    try {
      await User.deleteMany({});
      await Balance.deleteMany({});
      assert.ok(true);
    } catch (e) {
      assert.ok(false);
    }
  });
  it(`POST /${process.env.VERSION}/user/sign-up [200]`, (done) => {
    chai
      .request(app)
      .post(`/${process.env.VERSION}/user/sign-up`)
      .send(userOne)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        const { user } = res.body;
        user.should.have.property('email');
        user.should.have.property('clave');
        expect(user.email).to.equal(userOne.email);
        user.should.have.property('_balance');
        const { _balance } = user;
        _balance.should.have.property('money');
        expect(_balance.money).to.equal(0);
        done();
      });
  });
  it(`POST /${process.env.VERSION}/user/sign-up [UserExistsError]`, (done) => {
    chai
      .request(app)
      .post(`/${process.env.VERSION}/user/sign-up`)
      .send(userOne)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        const { message } = res.body.error;
        expect(message).to.equal('UserExistsError');
        done();
      });
  });
  it(`POST /${process.env.VERSION}/user/login [200]`, (done) => {
    chai
      .request(app)
      .post(`/${process.env.VERSION}/user/login`)
      .send({
        email: userOne.email,
        password: userOne.password,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        const { user } = res.body;
        user.should.have.property('email');
        expect(user.email).to.equal(userOne.email);
        user.should.have.property('_balance');
        const { _balance } = user;
        _balance.should.have.property('money');
        expect(_balance.money).to.equal(0);
        expect(res.header).to.have.property('auth');
        const token = res.header.auth;
        token.should.be.a('string');
        done();
      });
  });
  it(`POST /${process.env.VERSION}/user/sign-up [Add another user]`, (done) => {
    chai
      .request(app)
      .post(`/${process.env.VERSION}/user/sign-up`)
      .send(userTwo)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        const { user } = res.body;
        user.should.have.property('email');
        expect(user.email).to.equal(userTwo.email);
        user.should.have.property('_balance');
        const { _balance } = user;
        _balance.should.have.property('money');
        expect(_balance.money).to.equal(0);
        done();
      });
  });
});
