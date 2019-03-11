const {each} = require('lodash');
module.exports = async function getPendingContactRequests() {
  const result = {
    sent: [],
    receive: [],
  };
  const contacts = await this.getContacts();
  console.log(contacts);

  contacts.forEach((contact) => {
    if (contact.accepted === false) {
      const relationUname = (contact.from === this.buser.uname) ? contact.relation : contact.from;
      const isRequester = (contact.from === this.buser.uname);

      const type = (isRequester) ? 'sent' : 'receive';
      result[type].push(relationUname);
    }
  });

  return result;
};
