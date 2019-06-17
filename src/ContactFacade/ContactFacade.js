/* eslint-disable no-param-reassign */
const Contact = require('../Contact/Contact.js');

/**
 * BUser needs some function from Wallet-lib, theses are passed to BUserFacade via `this.parent`
 * We can use that to overwrite our BUser method.
 */
const overwritedContact = (self, contact) => {
  // this method is used exclusively by the synchronize method.
  // We needed an already connected way to retrieve `get` a BUser, which is done by DPD already.
  contact.broadcastTransaction = (...args) => self.parent.broadcastTransaction(...args);
  return contact;
};

class ContactFacade {
  constructor(transporter, parent) {
    if (transporter) {
      this.transporter = transporter;
    }
    this.parent = parent;
  }

  create(args) {
    const contact = overwritedContact(this, new Contact(args));
    return contact;
  }
}

ContactFacade.prototype.getAll = require('./getAll');

module.exports = ContactFacade;
