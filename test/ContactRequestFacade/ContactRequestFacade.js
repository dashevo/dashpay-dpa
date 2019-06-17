const { expect } = require('chai');
const ContactRequestFacade = require('../../src/ContactRequestFacade/ContactRequestFacade');


describe('DashPay DAP - ContactRequestFacade', () => {
  it('should init', () => {
    const mockedTransport = {};
    const facade = new ContactRequestFacade(mockedTransport, null);
  });

});
