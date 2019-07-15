const { expect } = require('chai');
const Contact = require('../../src/Profile/Contact/Contact');

const expectedContact = {
  publicKey: null,
  toUserId: null,
  userId: null
};

describe('DashPay DPA - Contact', () => {
  it('should create a contact', () => {
    const contact = new Contact(expectedContact);
    expect(contact.constructor.name)
      .to
      .equal(Contact.name);
  });
  it('should export', () => {
    const contact = new Contact(expectedContact);
    const json = contact.toJSON();
    expect(json)
      .to
      .be
      .deep
      .equal(JSON.stringify(expectedContact));
  });
  it('should clone', () => {
    const contact1 = new Contact(expectedContact);
    const contact2 = new Contact(contact1);
    expect(contact1)
      .to
      .be
      .deep
      .equal(contact2);
  });
});
