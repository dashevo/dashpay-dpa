const _ = require('lodash');


// Only the person that has deleted the contact won't see it, the other will
// have to do the same. As we don't look up for fund, we might also miss some money...
module.exports = async function getDeletedContactRequests() {
  const result = {
    sent: [],
    received: [],
  };
  const contacts = await this.getContacts(true);

  _.each(contacts, (contact, contactName) => {
    if (contact.status === 'deleted') {
      const isRequester = (contact.requester === this.buser.uname);
      if (isRequester) {
        const type = (isRequester) ? 'sent' : 'received';
        result[type].push(contactName);
      }
    }
  });

  return result;
};
