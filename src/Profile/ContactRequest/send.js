module.exports = async function send() {
  if (!this.sender || !this.receiver) {
    throw new Error('Both receiver and sender are required to send a contact request');
  }
  if (!this.sender.buser.isOwned) {
    throw new Error('Sender buser should be owned first');
  }
  const contactReqDocument = this.sender.buser.dpp.document.create('contact', {
    toUserId: this.receiver.buser.regtxid,
    publicKey: this.sender.buser.pubkeyid,
  });
  contactReqDocument.removeMetadata();

  const result = this.sender.buser.dpp.document.validate(contactReqDocument);
  if (!result.isValid()) {
    throw new Error('Invalid request');
  }

  const {
    serializedTransaction,
    serializedPacket,
  } = this.sender.buser.prepareStateTransition(contactReqDocument, this.sender.buser, this.sender.buser.privateKey);


  const txid = await this.sender.broadcastTransition(
    serializedTransaction,
    serializedPacket,
  );

  console.log(`ContactRequest to ${this.receiver.buser.username} sent (txid ${txid}.`);
  return txid;
};
