module.exports = async function sendContactRequest(bUserName) {
  if (this.buser === null) {
    try {
      this.buser = await this.getBUserByUname(this.username);
    } catch (e) {
      throw new Error('BUser not registered. Can\'t send contact req');
    }
  }

  // We prepare our object
  const contact = this.dpp.document.create('contact');
  contact.act = 0;

  const contactNb = 0;
  const path = `m/2/0/${contactNb.toFixed()}`;

  const hdpubkey = this.keyChain.getKeyForPath(path).hdPublicKey;

  Object.assign(contact, {
    action: 'request',
    content: hdpubkey.toString(),
    relation: bUserName,
    from: this.buser.uname,
  });

  // console.log(contact);
  const {
    serializedTransaction,
    serializedPacket,
  } = this.prepareStateTransition(contact, this.buser, this.getBUserPrivateKey().toString('hex'));

  const txid = await this.broadcastTransition(
    serializedTransaction, serializedPacket,
  );

  // const tx = 0;

  console.log(`Contact Request to ${bUserName} sent (txid ${txid}.`);
  return txid;
};
