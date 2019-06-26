const { each } = require('lodash');

module.exports = async function getPendingContactRequests() {
  const result = {
    sent: [],
    received: [],
  };

  const contacts = await this.contact.getAll(true);

  each(contacts, (contact, contactName) => {
    if (contact.status === 'requested') {
      const isRequester = (contact.requester === this.buser.uname);

      const type = (isRequester) ? 'sent' : 'received';
      result[type].push(contactName);
    }
  });


  return result;
};
