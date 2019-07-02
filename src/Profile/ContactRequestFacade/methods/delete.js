const { each } = require('lodash');

module.exports = async function deleteContactRequest(bUserName) {
  if (this.buser === null) {
    try {
      this.buser = await this.getBUserByUname(this.username);
    } catch (e) {
      throw new Error('BUser not registered. Can\'t delete contact request');
    }
  }

  const contacts = await this.getContacts();

  let existContact = false;
  each(contacts, (contact, contactName) => {
    if (contactName === bUserName) existContact = true;
  });
  if (!existContact) {
    throw new Error(`No existing contact with ${bUserName}`);
  }

  // We prepare our object
  const contact = this.dpp.document.create('contact');
  contact.act = 0;

  Object.assign(contact, {
    action: 'delete',
    content: '',
    relation: bUserName,
    from: this.buser.uname,
  });

  const {
    serializedTransaction,
    serializedPacket,
  } = this.prepareStateTransition(contact, this.buser, this.buser.privateKey);

  const txid = await this.broadcastTransition(
    serializedTransaction, serializedPacket,
  );

  // const txid = 0;

  console.log(`Deny contact to ${bUserName} sent (txid ${txid}.`);
  return txid;
};
