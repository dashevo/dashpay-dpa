const { expect } = require('chai');
const ProfileFacade = require('../../src/ProfileFacade/ProfileFacade');


let facade;
describe('DashPay DAP - ProfileFacade', () => {
  it('should init', () => {
    const mockedTransport = {};
    facade = new ProfileFacade(mockedTransport, null);
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
  it('should create with method imported from wallet-lib', () => {
    const mockedTransport = {};
    const importedMethods = {
      prepareStateTransition: () => 1,
      broadcastTransition: () => 2
    };
    const fullMockedFacade = new ProfileFacade(mockedTransport, importedMethods);
    expect(fullMockedFacade).to.exist;
    expect(fullMockedFacade.transporter)
      .to
      .equal(mockedTransport);
    expect(fullMockedFacade.importedMethods)
      .to
      .equal(importedMethods);

    const profile = fullMockedFacade.create();
    expect(profile).to.have.property('avatar')
    expect(profile).to.have.property('bio')
    expect(profile).to.have.property('prepareStateTransition');
    expect(profile).to.have.property('broadcastTransition');
    expect(profile.prepareStateTransition()).to.equal(1);
    expect(profile.broadcastTransition()).to.equal(2);
  });
});
