const { each } = require('lodash');

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
module.exports = determineAcceptedContact;
