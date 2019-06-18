// const { each } = require('lodash');

module.exports = async function getDeniedContactRequests() {
  const result = {
    sent: [],
    received: [],
  };
  // const contacts = await this.getContacts(true);
  //
  // each(contacts, (contact, contactName) => {
  //   if (contact.status === 'denied') {
  //     const isRequester = (contact.requester === this.buser.uname);
  //
  //     const type = (isRequester) ? 'sent' : 'received';
  //     result[type].push(contactName);
  //   }
  // });

  return result;
};
