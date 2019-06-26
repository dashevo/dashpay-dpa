/* eslint-disable no-param-reassign */
const ContactRequest = require('../ContactRequest/ContactRequest.js');

/**
 * BUser needs some function from Wallet-lib, theses are passed to BUserFacade via `this.parent`
 * We can use that to overwrite our BUser method.
 */
const overwritedContact = (self, contactReq) => {
  // this method is used exclusively by the synchronize method.
  // We needed an already connected way to retrieve `get` a BUser, which is done by DPD already.
  contactReq.broadcastTransition = (...args) => self.importedMethods.broadcastTransition(...args);
  contactReq.broadcastTransaction = self.importedMethods.broadcastTransaction;
  contactReq.sendRawTransition = self.importedMethods.sendRawTransition;
  contactReq.prepareStateTransition = (...args) => self.importedMethods
    .prepareStateTransition(...args);
  return contactReq;
};

class ContactRequestFacade {
  constructor(transporter, importedMethods = {}) {
    if (transporter) {
      this.transporter = transporter;
    }
    this.contact = importedMethods.contact;
    this.importedMethods = importedMethods;
  }

  create(args) {
    const contactReq = overwritedContact(this, new ContactRequest(args));
    return contactReq;
  }
}

ContactRequestFacade.prototype.getAllDeleted = require('./getAllDeleted');
ContactRequestFacade.prototype.getAllDenied = require('./getAllDenied');
ContactRequestFacade.prototype.getAllPending = require('./getAllPending');
ContactRequestFacade.prototype.accept = require('./accept');
ContactRequestFacade.prototype.delete = require('./delete');
ContactRequestFacade.prototype.deny = require('./deny');

module.exports = ContactRequestFacade;
