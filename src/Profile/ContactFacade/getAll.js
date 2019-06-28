// eslint-disable-next-line no-unused-vars
const { each } = require('lodash');

// eslint-disable-next-line no-unused-vars
module.exports = async function getContacts(displayAll = false) {
  const contacts = {};
  const { buser } = this.profile;
  const contractId = buser.dpp.getContract()
    .getId();

  const pubKey = buser.privateKey.toString('hex');
  const { regtxid } = buser;


  // const initiatedContactOpts = { where: { userId: regtxid } };
  // const initiatedContact = await buser.transporter.fetchDocuments(contractId, 'contact', initiatedContactOpts);
  // console.log(initiatedContact);

  // const receivedContactOpts = { toUserId: regtxid };
  // const receivedContactOpts = {toUserId: regtxid };
  // console.log(receivedContactOpts, regtxid);
  // const receivedContact = await buser.transporter.fetchDocuments(contractId, 'contact', receivedContactOpts);
  // console.log(receivedContact);

  const allContacts = await buser.transporter.fetchDocuments(contractId, 'contact', {});

  const receivedContact = allContacts.filter(contact => contact.toUserId === regtxid);

  const initiatedContact = allContacts.filter(contact => contact.$meta.userId === regtxid);

  contacts.received = receivedContact;
  contacts.sent = initiatedContact;

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
