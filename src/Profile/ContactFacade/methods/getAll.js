// eslint-disable-next-line no-unused-vars
const _ = require('lodash');
const determineAcceptedContact = require('../utils/determineAcceptedContact');
const documentsToContacts = require('../utils/documentsToContacts');
const fetchProfileFromContactsToUserId = require('../utils/fetchProfileFromContactsToUserId');
// eslint-disable-next-line no-unused-vars
module.exports = async function getAll(displayAll = false) {
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

  const contacts = determineAcceptedContact(allContacts, this.profile);
  return fetchProfileFromContactsToUserId(contacts, this.profile);
};
