const { each, filter } = require('lodash');

const determinePendingContact = function (contacts) {
  const { initiated, received } = contacts;
  const pendingContacts = {
    sent: [],
    received: [],
  };

  // We detect which are the tx we sent but got no answer back
  each(initiated, (initiatedEl) => {
    const predicate = receivedEl => receivedEl.userId === initiatedEl.toUserId;
    const nbDocFromReceiverUserID = filter(received, predicate).length;
    if (nbDocFromReceiverUserID === 0) pendingContacts.sent.push(initiatedEl);
  });

  // We do the same for received
  each(received, (receivedEl) => {
    const predicate = initiatedEl => initiatedEl.userId === receivedEl.toUserId;
    const nbDocFromSenderUserID = filter(received, predicate).length;
    if (nbDocFromSenderUserID === 0) pendingContacts.received.push(receivedEl);
  });

  return pendingContacts;
};
module.exports = determinePendingContact;
