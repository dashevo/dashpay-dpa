const { each, filter } = require('lodash');

const determineAcceptedContact = function (contacts) {
  const { initiated, received } = contacts;
  const acceptedContact = [];

  // We detect which are the tx we sent and got exactly one answer back
  each(initiated, (initiatedEl) => {
    const predicate = receivedEl => initiatedEl.toUserId === receivedEl.userId;
    const nbResponse = filter(received, predicate).length;
    if (nbResponse === 1) acceptedContact.push(initiatedEl);
  });

  // We do the same for received
  each(received, (receivedEl) => {
    const predicate = initiatedEl => receivedEl.toUserId === initiatedEl.userId;
    const nbResponse = filter(received, predicate).length;
    if (nbResponse === 1) acceptedContact.push(receivedEl);
  });

  return acceptedContact;
};
module.exports = determineAcceptedContact;
