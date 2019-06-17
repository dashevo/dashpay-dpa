const { expect } = require('chai');
const ProfileFacade = require('../../src/ProfileFacade/ProfileFacade');


describe('DashPay DAP - ProfileFacade', () => {
  it('should init', () => {
    const mockedTransport = {};
    const facade = new ProfileFacade(mockedTransport, null);
  });

});
