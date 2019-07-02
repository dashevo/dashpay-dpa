const { expect } = require('chai');
const ContactRequest = require('../../src/Profile/ContactRequest/ContactRequest');

const expectedContactRequest = {
  receiver: null,
  sender: null,
  state: 'unknown'
};

describe('DashPay DAP - ContactRequest', () => {
  it('should create a contract request', () => {
    const contactReq = new ContactRequest(expectedContactRequest);
    expect(contactReq.constructor.name).to.equal(ContactRequest.name);
  });
  it('should export', () => {
    const contactReq = new ContactRequest(expectedContactRequest);
    const json = contactReq.toJSON();
    expect(json)
      .to
      .be
      .deep
      .equal(JSON.stringify(expectedContactRequest));
  });
  it('should clone', () => {
    const contactReq1 = new ContactRequest(expectedContactRequest);
    const contactReq2 = new ContactRequest(contactReq1);
    expect(contactReq1)
      .to
      .be
      .deep
      .equal(contactReq2);
  });
});
