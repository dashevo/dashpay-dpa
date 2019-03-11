const Schema = require('@dashevo/dash-schema/dash-schema-lib');


module.exports = async function denyContactRequest(bUserName) {
  if (this.buser === null) {
    throw new Error('BUser not registered. Can\'t send contact request');
  }

  const pending = await this.getPendingContactRequests();

  const existPending = !!pending.received.filter(received => received === bUserName).length;
  if (!existPending) {
    throw new Error(`No pending contact request from ${bUserName}`);
  }

  // We prepare our object
  const contact = Schema.create.dapobject('contact');
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
  } = this.prepareStateTransition(contact, this.buser, this.getBUserPrivateKey().toString('hex'));

  const txid = await this.broadcastTransition(
    serializedTransaction, serializedPacket,
  );

  // const txid = 0;

  console.log(`Deny contact to ${bUserName} sent (txid ${txid}.`);
  return txid;
};
