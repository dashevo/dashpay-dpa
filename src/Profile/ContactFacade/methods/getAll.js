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

  const pubKey = buser.privateKey.toString('hex');
  const { regtxid } = buser;


  const initiatedContactOpts = { where: { userId: regtxid } };
  const initiatedContacts = documentsToContacts(await buser.transporter.fetchDocuments(contractId, 'contact', initiatedContactOpts));

  const receivedContactOpts = { where: { 'document.toUserId': regtxid } };
  const receivedContacts = documentsToContacts(await buser.transporter.fetchDocuments(contractId, 'contact', receivedContactOpts));

  const allContacts = { initiated: initiatedContacts, received: receivedContacts };

  // First we have to determine which one correspond to what

  contacts.pending = determinePendingContact(allContacts, this.profile);
  console.log(contacts.pending);
  // contacts.accepted = determineAcceptedContact(allContacts, this.profile);
  // contacts.deleted = determineDeletedContact(allFilteredContacts, regtxid);
  // contacts.denied = determineDeniedContact(allFilteredContacts, regtxid);

  // THen we determines profile from contacts.
  // const allContacts = await fetchProfileFromContacts([].concat(receivedContact, initiatedContact), this.profile);

  // console.log('All Profiles', allContacts);


  //
  // const receivedContact = allContacts.filter(contact => contact.toUserId === regtxid);
  //
  // const initiatedContact = allContacts.filter(contact => contact.$meta.userId === regtxid);

  // const pending = determinePendingContact([].concat(receivedContact, initiatedContact), regtxid);
  // contacts.received = receivedContact;
  // contacts.sent = initiatedContact;


  return contacts;
  /** if (this.buser === null) {
    try {
      this.buser = await this.getBUserByUname(this.username);
    } catch (e) {
      throw new Error('BUser not registered. Can\'t get contacts');
    }
  }
   const contractId = this.parent.dpp.getContract().getId();
   const dapObjects = await this.transporter.fetchDocuments(contractId, 'contact', {});

   const contacts = {};

   const { uname } = this.buser;

   const ensureContact = (contact) => {
    const relationUname = (contact.from === uname) ? contact.relation : contact.from;

    if (!contacts[relationUname]) {
      contacts[relationUname] = {
        status: 'requested',
      };
    }
  };
   dapObjects.forEach((contact) => {
    if (contact.relation === uname || contact.from === uname) {
      ensureContact(contact);
      const relationUname = (contact.from === uname) ? contact.relation : contact.from;
      switch (contact.action) {
        case 'request':
          contacts[relationUname].requester = contact.from;
          if (relationUname === contact.from) contacts[relationUname].hdPublicKey = contact.content;
          break;
        case 'accept':
          contacts[relationUname].status = 'accepted';
          if (relationUname === contact.from) contacts[relationUname].hdPublicKey = contact.content;
          break;
        case 'deny':
          contacts[relationUname].status = 'denied';
          break;
        case 'delete':
          contacts[relationUname].status = 'deleted';
          break;
        default:
          console.log('Unexpected default', contact.action);
          break;
      }
    }

    if (!displayAll) {
      each(contacts, (contactEl, contactName) => {
        if (['requested', 'denied', 'deleted'].includes(contactEl.status)) {
          delete contacts[contactName];
        }
      });
    }
  });

   return contacts;* */
};
