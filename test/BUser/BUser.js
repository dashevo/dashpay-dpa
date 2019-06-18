const { expect } = require('chai');
const { PrivateKey } = require('@dashevo/dashcore-lib');
const BUser = require('../../src/BUser/BUser');
const BUserFacade = require('../../src/BUserFacade/BUserFacade');

const expectedBasicBUser = {
  state: 'unknown',
  isOwned: false,
  username: 'unittest_username1',
  synchronizedLast: null,
};
let facade;
describe('DashPay DAP - BUser', () => {
  // before((done) => {
    // const transport =
    // facade = new BUserFacade(transport)
    // done();
  // });
  it('should create an object from a username', () => {
    const buser = new BUser('unittest_username1');
    console.log(buser)
    expect(buser.state)
      .to
      .equal(expectedBasicBUser.state);
    expect(buser.isOwned)
      .to
      .equal(expectedBasicBUser.isOwned);
    expect(buser.username)
      .to
      .equal(expectedBasicBUser.username);
    expect(buser.synchronizedLast)
      .to
      .equal(expectedBasicBUser.synchronizedLast);
  });
  it('should create an object from an object', () => {
    const buserObject = {
      isOwned: false,
      state: 'unknown',
      username: 'unittest_username1',
    };
    const buser = new BUser(buserObject);
    expect(buser.state)
      .to
      .equal(expectedBasicBUser.state);
    expect(buser.isOwned)
      .to
      .equal(expectedBasicBUser.isOwned);
    expect(buser.username)
      .to
      .equal(expectedBasicBUser.username);
    expect(buser.synchronizedLast)
      .to
      .equal(expectedBasicBUser.synchronizedLast);
  });
  it('should export to JSON and be valid', () => {
    const buser = new BUser(expectedBasicBUser);
    const jsonBuser = buser.toJSON();
    expect(jsonBuser)
      .to
      .deep
      .equal(expectedBasicBUser);

    expect(new BUser(jsonBuser))
      .to
      .deep
      .equal(buser);
  });
  it('should be able to synchronize', async () => {
    const buser = new BUser(expectedBasicBUser);
    let called = 0;
    const get = () => {
      called += 1;
    };
    buser.get = get;

    await buser.synchronize();
    expect(called)
      .to
      .equal(1);

  });
  it('should be able to own', () => {
    const buser = new BUser(expectedBasicBUser);
    const privateKey = new PrivateKey();
    buser.own(privateKey);
    expect(buser.privateKey)
      .to
      .equal(privateKey.toString());
    expect(buser.isOwned)
      .to
      .equal(true);
  });
});
