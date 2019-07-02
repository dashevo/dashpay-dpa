// eslint-disable-next-line no-unused-vars
const _ = require('lodash');
const determineAcceptedContact = require('../utils/determineAcceptedContact');
const determineDeletedContact = require('../utils/determineDeletedContact');
const determineDeniedContact = require('../utils/determineDeniedContact');
const determinePendingContact = require('../utils/determinePendingContact');
const documentsToContacts = require('../utils/documentsToContacts');
const fetchProfileFromContacts = require('../utils/fetchProfileFromContacts');
// eslint-disable-next-line no-unused-vars
module.exports = async function getAll(displayAll = false) {
  const contacts = {};
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
  console.log(allContacts)

  // First we have to determine which one correspond to what
  contacts.pending = determinePendingContact(allContacts, this.profile);
  contacts.accepted = determineAcceptedContact(allContacts, this.profile);
  // Question : How do we know that a document existed by got removed to not
  // Mistakes it with a pending ?
  // contacts.deleted = determineDeletedContact(allFilteredContacts, regtxid);
  // contacts.denied = determineDeniedContact(allFilteredContacts, regtxid);

  // We then determines profile from contacts.
  const profiles = await fetchProfileFromContacts(contacts, this.profile);
  return profiles;
};
