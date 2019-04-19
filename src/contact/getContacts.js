const _ = require('lodash');

module.exports = async function getContacts(displayAll = false) {
  if (this.buser === null) {
    try {
      this.buser = await this.getBUserByUname(this.username);
    } catch (e) {
      throw new Error('BUser not registered. Can\'t get contacts');
    }
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
        case 'delete':
          contacts[relationUname].status = 'deleted';
          break;
        default:
          console.log('Unexpected default', contact.action);
          break;
      }
    }

    if (!displayAll) {
      _.each(contacts, (contactEl, contactName) => {
        if (['requested', 'denied', 'deleted'].includes(contactEl.status)) {
          delete contacts[contactName];
        }
      });
    }
  });

  return contacts;
};
