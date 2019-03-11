const _ = require('lodash');

module.exports = async function getDeletedContactRequests() {
  const result = {
    sent: [],
    received: [],
  };
  const contacts = await this.getContacts(true);

  _.each(contacts, (contact, contactName) => {
    console.log(contact.status)
    if (contact.status === 'deleted') {
      const isRequester = (contact.requester === this.buser.uname);

      const type = (isRequester) ? 'sent' : 'received';
      result[type].push(contactName);
    }
  });

  return result;
};
