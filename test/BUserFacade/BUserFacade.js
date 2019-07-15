const { expect } = require('chai');
const BUserFacade = require('../../src/BUserFacade/BUserFacade');


let facade;
describe('DashPay DPA - BUserFacade', () => {
  it('should init', () => {
    const mockedTransport = {};
    facade = new BUserFacade(mockedTransport, null);
    expect(facade).to.exist;
    expect(facade.transporter)
      .to
      .equal(mockedTransport);
  });
  it('should offer interface for create', function () {
    expect(facade.create)
      .to
      .be
      .a('function');
  });
  it('should offer interface for get', function () {
    expect(facade.get)
      .to
      .be
      .a('function');
  });
  it('should offer interface for getById', function () {
    expect(facade.getById)
      .to
      .be
      .a('function');
  });
  it('should offer interface for getByUsername', function () {
    expect(facade.getByUsername)
      .to
      .be
      .a('function');
  });
  it('should create with method imported from wallet-lib', () => {
    const mockedTransport = {};
    const importedMethods = {
      broadcastTransition: () => 2,
      getUnusedAddress: () => 3,
      getBalance: () => 4,
      getUTXOS: () => 5,
      getPrivateKeys: () => 6,
      broadcastTransaction: () => 7,
      getBUserSigningPrivateKey: () => 8,
    };
    const fullMockedFacade = new BUserFacade(mockedTransport, importedMethods);
    expect(fullMockedFacade).to.exist;
    expect(fullMockedFacade.transporter)
      .to
      .equal(mockedTransport);
    expect(fullMockedFacade.importedMethods)
      .to
      .equal(importedMethods);

    const buser = fullMockedFacade.create();
    expect(buser).to.have.property('state')
    expect(buser).to.have.property('isOwned')
    expect(buser).to.have.property('synchronizedLast')
    expect(buser).to.have.property('get')
    expect(buser).to.have.property('getUnusedAddress')
    expect(buser.getUnusedAddress()).to.equal(3);

    expect(buser).to.have.property('getBalance')
    expect(buser.getBalance()).to.equal(4);

    expect(buser).to.have.property('getUTXOS')
    expect(buser.getUTXOS()).to.equal(5);

    expect(buser).to.have.property('getBUserSigningPrivateKey')
    expect(buser.getBUserSigningPrivateKey()).to.equal(8);

    expect(buser).to.have.property('getPrivateKeys')
    expect(buser.getPrivateKeys()).to.equal(6);

    expect(buser).to.have.property('broadcastTransaction')
    expect(buser.broadcastTransition()).to.equal(2);

    expect(buser).to.have.property('broadcastTransition')
    expect(buser.broadcastTransition()).to.equal(2);
  });
});
