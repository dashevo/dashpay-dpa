const { expect } = require('chai');
const ContactFacade = require('../../src/ContactFacade/ContactFacade');
const Contact = require('../../src/Contact/Contact');
const { PrivateKey } = require('@dashevo/dashcore-lib');
let facade;
let pk = new PrivateKey();
describe('DashPay DAP - ContactFacade', () => {
  it('should init', () => {
    const mockedTransport = {};
    const mockedMethods = {
      broadcastTransition: function () {
        return true;
      }
    };
    facade = new ContactFacade(mockedTransport, mockedTransport);
    expect(facade.transporter)
      .to
      .be
      .equal(mockedTransport);
    expect(facade.importedMethods)
      .to
      .be
      .equal(mockedTransport);
  });
  it('should create a contact', function () {
    const contact = facade.create({publicKey:pk.publicKey.toString()});
    expect(contact.constructor.name).to.equal(Contact.name);
  });
  it('should get all contacts', async function () {
    const contacts = await facade.getAll();
    expect(contacts).to.deep.equal({})
  });

});
