const { expect } = require('chai');
const ContactRequestFacade = require('../../src/ContactRequestFacade/ContactRequestFacade');
const ContactRequest = require('../../src/ContactRequest/ContactRequest');
const Contact =  require('../../src/Contact/Contact');
let facade;
let aliceContact = new Contact();
let bobContact = new Contact();
describe('DashPay DAP - ContactRequestFacade', () => {
  it('should init', () => {
    const mockedTransport = {};
    const mockedMethods = {
      broadcastTransition: function () {
        return true;
      }
    };
    facade = new ContactRequestFacade(mockedTransport, mockedMethods);
    expect(facade.transporter)
      .to
      .be
      .equal(mockedTransport);
    expect(facade.importedMethods)
      .to
      .be
      .equal(mockedMethods);
  });
  // it('should create a contactrequest', function () {
  //   const contact = facade.create({receiver:null, sender:null, state: 'unknown'});
  //   expect(contact.constructor.name).to.equal(ContactRequest.name);
  // });
  // it('should get all pending', async function () {
  //   const pending = await facade.getAllPending();
  //   expect(pending).to.deep.equal({sent:[], received:[]});
  // });
  // it('should get all denied', async function () {
  //   const denied = await facade.getAllDenied();
  //   expect(denied).to.deep.equal({sent:[], received:[]});
  // });
  // it('should get all deleted', async function () {
  //   const deleted = await facade.getAllDeleted();
  //   expect(deleted).to.deep.equal({sent:[], received:[]});
  // });
  it('should accept a contact request', async function f() {
    const contactRequest = facade.create({receiver: aliceContact, sender: bobContact });
    await facade.accept(contactRequest);
  })
  // it('should deny a contact request', async function f() {
  //   const contactRequest = facade.create({receiver: aliceContact, sender: bobContact });
  //   await facade.deny(contactRequest);
  // })
  // it('should delete a contact request', async function f() {
  //   const contactRequest = facade.create({receiver: aliceContact, sender: bobContact });
  //   await facade.delete(contactRequest);
  // })

});
