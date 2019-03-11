const Dashcore = require('@dashevo/dashcore-lib');
const Schema = require('@dashevo/dash-schema/dash-schema-lib');
const { doubleSha256 } = require('../utils/crypto.js');


module.exports = async function sendContactRequest(bUserName) {
  if (this.buser === null) {
    throw new Error('BUser not registered. Can\'t send contact request');
  }

  // We prepare our object
  const contact = Schema.create.dapobject('contact');
  contact.act = 0;

  const cUser = await this.getBUserByUname(bUserName);

  const contactNb = 0;
  const path = `m/2/0/${contactNb.toFixed()}`;

  const hdpubkey = this.keyChain.getKeyForPath(path).hdPublicKey;

  Object.assign(contact, {
    action: 'request',
    content: hdpubkey.toString(),
    relation: bUserName,
    from: this.buser.uname,
  });

  console.log(contact)
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
