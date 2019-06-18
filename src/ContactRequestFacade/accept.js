// eslint-disable-next-line no-unused-vars
module.exports = async function acceptContactRequest(contactRequest) {
  return null;
  // if (this.buser === null) {
  //   try {
  //     this.buser = await this.getBUserByUname(this.username);
  //   } catch (e) {
  //     throw new Error('BUser not registered. Can\'t accept contact request');
  //   }
  // }
  //
  // const pending = await this.getPendingContactRequests();
  // const existPending = !!pending.received.filter(received => received === bUserName).length;
  // if (!existPending) {
  //   throw new Error(`No pending contact request from ${bUserName}`);
  // }
  //
  // // We prepare our object
  // const contact = this.dpp.document.create('contact');
  // contact.act = 0;
  //
  // const contactNb = 0;
  // const path = `m/2/0/${contactNb.toFixed()}`;
  //
  // const hdpubkey = this.keyChain.getKeyForPath(path).hdPublicKey;
  //
  // Object.assign(contact, {
  //   action: 'accept',
  //   content: hdpubkey.toString(),
  //   relation: bUserName,
  //   from: this.buser.uname,
  // });
  //
  // const {
  //   serializedTransaction,
  //   serializedPacket,
  // } = this.prepareStateTransition(contact, this.buser,
  // this.getBUserPrivateKey().toString('hex'));
  //
  // const txid = await this.broadcastTransition(
  //   serializedTransaction, serializedPacket,
  // );
  //
  // // const tx = 0;
  //
  // console.log(`Accept contact to ${bUserName} sent (txid ${txid}.`);
  // return txid;
};
