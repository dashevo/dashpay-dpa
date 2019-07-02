// eslint-disable-next-line no-unused-vars
const _ = require('lodash');
const determinePendingContact = require('../utils/determinePendingContact');
const documentsToContacts = require('../utils/documentsToContacts');
const fetchProfileFromContactsUserId = require('../utils/fetchProfileFromContactsUserId');
const fetchProfileFromContactsToUserId = require('../utils/fetchProfileFromContactsToUserId');
const profilesToContactRequest = require('../utils/profilesToContactRequest');
// eslint-disable-next-line no-unused-vars
module.exports = async function getPendingContactRequest(displayAll = false) {
  const pendingContactRequests = {};

  const { buser } = this.profile;
  const contractId = buser.dpp.getContract()
    .getId();
  const { regtxid } = buser;


  const initiatedContactOpts = { where: { userId: regtxid } };
  const initiatedContacts = documentsToContacts(await buser.transporter.fetchDocuments(contractId, 'contact', initiatedContactOpts));

  const receivedContactOpts = { where: { 'document.toUserId': regtxid } };
  const receivedContacts = documentsToContacts(await buser.transporter.fetchDocuments(contractId, 'contact', receivedContactOpts));

  const allContacts = {
    initiated: initiatedContacts,
    received: receivedContacts,
  };

  const contacts = determinePendingContact(allContacts, this.profile);
  // We then determines profile from contacts.
  const sentProfiles = await fetchProfileFromContactsToUserId(contacts.sent, this.profile)
  const receivedProfiles = await fetchProfileFromContactsUserId(contacts.received, this.profile)

  pendingContactRequests.sent = profilesToContactRequest(sentProfiles, this.profile, true);
  pendingContactRequests.received = profilesToContactRequest(receivedProfiles, this.profile, false);

  return pendingContactRequests;
};
