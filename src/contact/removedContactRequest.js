const Schema = require('@dashevo/dash-schema/dash-schema-lib');


module.exports = async function acceptContactRequest(bUserName) {
  if (this.buser === null) {
    throw new Error('BUser not registered. Can\'t send contact request');
  }

  const pending = await this.getPendingContactRequests();
  const existPending = !!pending.received.filter(received => received.from === bUserName).length;
  if (!existPending) {
    throw new Error(`No pending contact request from ${bUserName}`);
  }

  // We prepare our object
  const contact = Schema.create.dapobject('contact');
  contact.act = 0;

  const contactNb = 0;
  const path = `m/2/0/${contactNb.toFixed()}`;

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
