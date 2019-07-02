// eslint-disable-next-line no-unused-vars
const _ = require('lodash');
const determineAcceptedContact = require('../utils/determineAcceptedContact');
const documentsToContacts = require('../utils/documentsToContacts');
const fetchProfileFromContactsToUserId = require('../utils/fetchProfileFromContactsToUserId');
const profilesToContactRequest = require('../utils/profilesToContactRequest');
// eslint-disable-next-line no-unused-vars
module.exports = async function getAcceptedSentContactRequest() {
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

  const contacts = determineAcceptedContact(allContacts, this.profile);

  const acceptedContact = _.intersection(contacts, allContacts.initiated);
  const acceptedProfiles = await fetchProfileFromContactsToUserId(acceptedContact, this.profile);
  return profilesToContactRequest(acceptedProfiles, this.profile, true);
};
