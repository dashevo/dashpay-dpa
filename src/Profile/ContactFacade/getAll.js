// eslint-disable-next-line no-unused-vars
const { each } = require('lodash');

const determinePendingContact = function (contactArr, profile) {
  const { regtxid } = profile.buser;
  const sentToUserId = [];
  const receivedFromUserId = [];

  each(contactArr, (contact) => {
    if (contact.$meta.userId === regtxid) {
      // Then we are sender
      sentToUserId.push(contact.toUserId);
    }
    if (contact.toUserId === regtxid) {
      receivedFromUserId.push(contact.$meta.userId);
    }
  });

  const pending = {
    sent: [],
    received: [],
  };

  // We detect which are the tx we sent but got no answer back
  each(sentToUserId, (toUserId) => {
    if (!receivedFromUserId.includes(toUserId)) {
      pending.sent.push(toUserId);
    }
  });
  each(receivedFromUserId, (fromUserId) => {
    if (!sentToUserId.includes(fromUserId)) {
      pending.received.push(fromUserId);
    }
  });
  return pending;
};

const determineAcceptedContact = function (contactArr, profile) {
  const { regtxid } = profile.buser;

  const sentToUserId = [];
  const receivedFromUserId = [];

  each(contactArr, (contact) => {
    if (contact.$meta.userId === regtxid) {
      // Then we are sender
      sentToUserId.push(contact.toUserId);
    }
    if (contact.toUserId === regtxid) {
      receivedFromUserId.push(contact.$meta.userId);
    }
  });

  const accepted = {
    sent: [],
    received: [],
  };

  // We detect which are the tx we sent but got no answer back
  each(sentToUserId, (toUserId) => {
    if (receivedFromUserId.includes(toUserId)) {
      accepted.sent.push(toUserId);
    }
  });
  each(receivedFromUserId, (fromUserId) => {
    if (sentToUserId.includes(fromUserId)) {
      accepted.received.push(fromUserId);
    }
  });
  return accepted;
};
const determineDeletedContact = function (contactArr, profile) {
  const { regtxid } = profile.buser;

  const sentToUserId = [];
  const receivedFromUserId = [];

  each(contactArr, (contact) => {
    if (contact.$meta.userId === regtxid) {
      // Then we are sender
      sentToUserId.push(contact.toUserId);
    }
    if (contact.toUserId === regtxid) {
      receivedFromUserId.push(contact.$meta.userId);
    }
  });

  const accepted = {
    sent: [],
    received: [],
  };

  // We detect which are the tx we sent but got no answer back
  each(sentToUserId, (toUserId) => {
    if (receivedFromUserId.includes(toUserId)) {
      accepted.sent.push(toUserId);
    }
  });
  each(receivedFromUserId, (fromUserId) => {
    if (sentToUserId.includes(fromUserId)) {
      accepted.received.push(fromUserId);
    }
  });
  return accepted;
};
const determineDeniedContact = function (contactArr, profile) {
  const { regtxid } = profile.buser;

  const sentToUserId = [];
  const receivedFromUserId = [];

  each(contactArr, (contact) => {
    if (contact.$meta.userId === regtxid) {
      // Then we are sender
      sentToUserId.push(contact.toUserId);
    }
    if (contact.toUserId === regtxid) {
      receivedFromUserId.push(contact.$meta.userId);
    }
  });

  const accepted = {
    sent: [],
    received: [],
  };

  // We detect which are the tx we sent but got no answer back
  each(sentToUserId, (toUserId) => {
    if (receivedFromUserId.includes(toUserId)) {
      accepted.sent.push(toUserId);
    }
  });
  each(receivedFromUserId, (fromUserId) => {
    if (sentToUserId.includes(fromUserId)) {
      accepted.received.push(fromUserId);
    }
  });
  return accepted;
};

// eslint-disable-next-line no-unused-vars
module.exports = async function getAll(displayAll = false) {
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
  // const receivedContactOpts = { where: { $scope: 'f98e30ec7dbc2145c7189b71085b166cdba5381a4d838514559a4b452dca701d' } };
  // console.log(receivedContactOpts, regtxid);
  // const receivedContact = await buser.transporter.fetchDocuments(contractId, 'contact', receivedContactOpts);
  // console.log(receivedContact);


  const allContacts = await buser.transporter.fetchDocuments(contractId, 'contact', {});
  console.log(allContacts.length);
  const allFilteredContacts = allContacts
    .filter(contact => contact.toUserId === regtxid || contact.$meta.userId === regtxid);
  contacts.pending = determinePendingContact(allFilteredContacts, this.profile);
  contacts.accepted = determineAcceptedContact(allFilteredContacts, this.profile);
  // contacts.deleted = determineDeletedContact(allFilteredContacts, regtxid);
  // contacts.denied = determineDeniedContact(allFilteredContacts, regtxid);
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
