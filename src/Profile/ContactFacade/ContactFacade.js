/* eslint-disable no-param-reassign */
const Contact = require('../Contact/Contact.js');
const getAcceptedSentContactRequest = require('./methods/getAcceptedSentContactRequest');
const getAll = require('./methods/getAll');
const getPendingContactRequest = require('./methods/getPendingContactRequest');
/**
 * BUser needs some function from Wallet-lib, theses are passed to BUserFacade via `this.parent`
 * We can use that to overwrite our BUser method.
 */
const overwritedContact = (self, contact) => {
  // this method is used exclusively by the synchronize method.
  // We needed an already connected way to retrieve `get` a BUser, which is done by DPD already.
  contact.broadcastTransaction = (...args) => self.importedMethods.broadcastTransaction(...args);
  return contact;
};

class ContactFacade {
  constructor(transporter, profile, profileFacade, importedMethods = {}) {
    if (transporter) {
      this.transporter = transporter;
    }
    this.profile = profile;
    this.importedMethods = importedMethods;
  }

  create(args) {
    const contact = overwritedContact(this, new Contact(args));
    return contact;
  }
}

ContactFacade.prototype.getAll = getAll;
ContactFacade.prototype.getPendingRequest = getPendingContactRequest;
ContactFacade.prototype.getAcceptedSentContactRequest = getAcceptedSentContactRequest;

module.exports = ContactFacade;
