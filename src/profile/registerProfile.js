const Dashcore = require('@dashevo/dashcore-lib');
 const Schema = require('@dashevo/dash-schema/dash-schema-lib');
 const {doubleSha256} = require('../utils/crypto.js')
 const dapschema = require('../schema/dashpay.schema')

 /**
 *
 * @param avatar - b64 representation or url of the avatar
 * @param bio - string
 * @param displayName - string
 * @param props - string - stringified object of additional props.
 * @return {Promise<string>}
 */
module.exports = async function registerProfile(avatar='', bio='', displayName='', props =''){
  const dapId = this.dapId;

  const buser = this.getBUser();

  //We prepare our object
  const profile = Schema.create.dapobject('profile');

  Object.assign(profile, {
    avatar,
    displayName,
    props,
    bio
  });

  const stPacket = Schema.create.stpacket(profile, dapId, dapschema);

  const transaction = new Dashcore.Transaction()
    .setType(Dashcore.Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION);

  const serializedPacket = Schema.serialize.encode(stPacket);
  const stPacketHash = doubleSha256(serializedPacket).toString('hex');

  const payload = transaction.extraPayload
    .setRegTxId(buser.regtxid)
    .setHashPrevSubTx(Array.from(buser.subtx).pop())
    .setHashSTPacket(stPacketHash)
    .setCreditFee(1000)
    .sign(this.getBUserPrivateKey())

  //

  // Attach payload to transaction object
  transaction
    .setExtraPayload(payload)

  // TODO : Better fees selection
  const utxo = this.getUTXOS()[0];
  const {address, satoshis} = utxo;

  transaction.from([utxo]).to([{ address, satoshis }])

  const privateKeys = this.getPrivateKeys(
    this.getUTXOS()
    .map(item => item.address))
    .map(hdpk => hdpk.privateKey);

  const signedTransaction = transaction.sign(privateKeys, Dashcore.crypto.Signature.SIGHASH_ALL);
  const txid = await this.broadcastTransaction(transaction.toString());
  console.log(`Profile ${displayName}  Registered (txid ${txid}.`);
  return txid;
}
