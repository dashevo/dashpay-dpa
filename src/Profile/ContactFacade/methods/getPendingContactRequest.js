// eslint-disable-next-line no-unused-vars
const _ = require('lodash');
const determinePendingContact = require('../utils/determinePendingContact');
const documentsToContacts = require('../utils/documentsToContacts');
const fetchProfileFromContactsUserId = require('../utils/fetchProfileFromContactsUserId');
const fetchProfileFromContactsToUserId = require('../utils/fetchProfileFromContactsToUserId');
const profilesToContactRequest = require('../utils/profilesToContactRequest');
// eslint-disable-next-line no-unused-vars
module.exports = async function getPendingContactRequest(displayAll = false) {
  const { buser } = this.profile;
  const contractId = buser.dpp.getContract()
    .getId();
  const { regtxid } = buser;


  const initiatedContactOpts = { where: { userId: regtxid } };

  const initiatedDocuments = await buser.transporter
    .fetchDocuments(contractId, 'contact', initiatedContactOpts);
  const initiatedContacts = documentsToContacts(initiatedDocuments);

  const receivedContactOpts = { where: { 'document.toUserId': regtxid } };

  const receivedDocuments = await buser.transporter
    .fetchDocuments(contractId, 'contact', receivedContactOpts);
  const receivedContacts = documentsToContacts(receivedDocuments);

  const allContacts = {
    initiated: initiatedContacts,
    received: receivedContacts,
  };

  const contacts = determinePendingContact(allContacts, this.profile);
  // We then determines profile from contacts.
  const sentProfiles = await fetchProfileFromContactsToUserId(contacts.sent, this.profile);
  const receivedProfiles = await fetchProfileFromContactsUserId(contacts.received, this.profile);

  const sent = await profilesToContactRequest(sentProfiles, this.profile, true);
  const received = await profilesToContactRequest(receivedProfiles, this.profile, false);

  return { sent, received };
};
