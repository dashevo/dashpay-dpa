module.exports = async function getRemovedContact(bUserName) {
  if (this.buser === null) {
    try {
      this.buser = await this.getBUserByUname(this.username);
    } catch (e) {
      throw new Error('BUser not registered. Can\'t remove a get removed contaxct');
    }
  }

  const pending = await this.getPendingContactRequests();
  const existPending = !!pending.received.filter(received => received.from === bUserName).length;
  if (!existPending) {
    throw new Error(`No pending contact request from ${bUserName}`);
  }

  // We prepare our object
  const contact = this.dpp.document.create('contact');
  contact.act = 0;

  Object.assign(contact, {
    action: 'removed',
    content: '',
    relation: bUserName,
    from: this.buser.uname,
  });

  const {
    serializedTransaction,
    serializedPacket,
  } = this.prepareStateTransition(contact, this.buser, this.getBUserPrivateKey().toString('hex'));

  const txid = await this.broadcastTransition(
    serializedTransaction, serializedPacket,
  );

  // const tx = 0;

  console.log(`Accept contact to ${bUserName} sent (txid ${txid}.`);
  return txid;
};
