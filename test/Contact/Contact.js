const { expect } = require('chai');
const Contact = require('../../src/Contact/Contact');

const expectedContact = {
};

describe('DashPay DAP - Contact', () => {
  it('should create an profile', () => {
    const contact = new Contact(expectedContact);
    expect(contact.constructor.name).to.equal(Contact.name);
  });
  it('should export', () => {
    const profile = new Contact(expectedContact);
    const json = profile.toJSON();
    expect(json)
      .to
      .be
      .deep
      .equal(JSON.stringify(expectedContact));
  });
  it('should clone', () => {
    const profile1 = new Contact(expectedContact);
    const profile2 = new Contact(profile1);
    expect(profile1)
      .to
      .be
      .deep
      .equal(profile2);
  });
});
