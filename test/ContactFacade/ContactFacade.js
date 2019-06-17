const { expect } = require('chai');
const ContactFacade = require('../../src/ContactFacade/ContactFacade');


describe('DashPay DAP - ContactFacade', () => {
  it('should init', () => {
    const mockedTransport = {};
    const facade = new ContactFacade(mockedTransport, null);
  });

});
