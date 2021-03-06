/* eslint-disable no-param-reassign */
const ContactRequest = require('../ContactRequest/ContactRequest.js');

/**
 * BUser needs some function from Wallet-lib, theses are passed to BUserFacade via `this.parent`
 * We can use that to overwrite our BUser method.
 */
const overwritedContact = (self, contactReq) => {
  const {
    prepareStateTransition,
    broadcastTransition,
    sendRawTransition,
  } = self.importedMethods;
  const { transporter } = self;
  // this method is used exclusively by the synchronize method.
  // We needed an already connected way to retrieve `get` a BUser, which is done by DPD already.
  contactReq.prepareStateTransition = (...args) => prepareStateTransition
    .call({ transporter }, ...args);
  contactReq.broadcastTransition = (...args) => broadcastTransition
    .call({ transporter }, ...args);
  contactReq.sendRawTransition = sendRawTransition;
  return contactReq;
};

class ContactRequestFacade {
  constructor(transporter, profile, importedMethods = {}) {
    if (transporter) {
      this.transporter = transporter;
    }
    this.profile = profile;
    this.contact = importedMethods.contact;
    this.importedMethods = importedMethods;
  }

  create(args) {
    if (!args.sender) args.sender = this.profile;
    const contactReq = overwritedContact(this, new ContactRequest(args));
    return contactReq;
  }
}

ContactRequestFacade.prototype.getAllPending = require('./methods/getAllPending');
ContactRequestFacade.prototype.accept = require('./methods/accept');
ContactRequestFacade.prototype.delete = require('./methods/delete');
ContactRequestFacade.prototype.deny = require('./methods/deny');

module.exports = ContactRequestFacade;
