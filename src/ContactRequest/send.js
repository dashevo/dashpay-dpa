module.exports = async function send() {
  if (!this.sender || !this.receiver) {
    throw new Error('Both receiver and sender are required to send a contact request');
  }
  if (!this.sender.isOwned) {
    throw new Error('Sender buser should be owned first');
  }
  const contactReqDocument = this.sender.dpp.document.create('contact', {
    toUserId: this.receiver.regtxid,
    publicKey: this.sender.privateKey.toString('hex'),
  });
  const result = this.sender.dpp.document.validate(contactReqDocument);
  if (!result.isValid()) {
    throw new Error('Invalid request');
  }
  const {
    serializedTransaction,
    serializedPacket,
  } = this.prepareStateTransition(contactReqDocument, this.sender, this.sender.privateKey);


  console.log(this.sender);


  const txid = await this.sender.broadcastTransition(
    serializedTransaction,
    serializedPacket,
  );

  console.log(`ContactRequest to ${this.receiver.username}  sent (txid ${txid}.`);
  return txid;
};
