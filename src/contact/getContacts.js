const _ = require('lodash');

module.exports = async function getContacts(displayAll = false) {
  if (this.buser === null) {
    throw new Error('BUser not registered. Can\'t send contact request');
  }
  const dapObjects = await this.transport.transport.fetchDapObjects(this.dapId, 'contact', {});

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
        case 'deleted':
          contacts[relationUname].status = 'deleted';
          break;
        default:
          console.log('Unexpected default', contact.action);
          break;
      }
    }

    if (!displayAll) {
      _.each(contacts, (contactEl, contactName) => {
        if (['requested', 'denied'].includes(contactEl.status)) {
          delete contacts[contactName];
        }
      });
    }
  });

  return contacts;
};
