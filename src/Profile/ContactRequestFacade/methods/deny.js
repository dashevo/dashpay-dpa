module.exports = async function denyContactRequest(bUserName) {
  if (this.buser === null) {
    try {
      this.buser = await this.getBUserByUname(this.username);
    } catch (e) {
      throw new Error('BUser not registered. Can\'t register profile');
    }
  }

  const pending = await this.getPendingContactRequests();

  const existPending = !!pending.received.filter(received => received === bUserName).length;
  if (!existPending) {
    throw new Error(`No pending contact request from ${bUserName}`);
  }

  // We prepare our object
  const contact = this.dpp.document.create('contact');
  contact.act = 0;

  Object.assign(contact, {
    action: 'deny',
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
