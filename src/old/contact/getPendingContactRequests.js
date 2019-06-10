const _ = require('lodash');

module.exports = async function getPendingContactRequests() {
  const result = {
    sent: [],
    received: [],
  };
  const contacts = await this.getContacts(true);

  _.each(contacts, (contact, contactName) => {
    if (contact.status === 'requested') {
      const isRequester = (contact.requester === this.buser.uname);

      const type = (isRequester) ? 'sent' : 'received';
      result[type].push(contactName);
    }
  });


  return result;
};