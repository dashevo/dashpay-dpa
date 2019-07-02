const { each } = require('lodash');
const Contact = require('../../Contact/Contact');

module.exports = function documentsToContacts(documents) {
  const contacts = [];
  each(documents, (document) => {
    const contact = new Contact({
      publicKey: document.publicKey,
      toUserId: document.toUserId,
      userId: document.$meta.userId,
    });
    contacts.push(contact);
  });
  return contacts;
};
