const Dashcore = require('@dashevo/dashcore-lib');
const Schema = require('@dashevo/dash-schema/dash-schema-lib');
const { doubleSha256 } = require('../utils/crypto.js');
const dapschema = require('../schema/dashpay.schema');
const { utils } = require('@dashevo/wallet-lib');

/**
 *
 * @param avatar - b64 representation or url of the avatar
 * @param bio - string
 * @param displayName - string
 * @param props - string - stringified object of additional props.
 * @return {Promise<string>}
 */
module.exports = async function registerProfile(avatar = '', bio = '', displayName = '', props = '') {
  const creditFeeSet = 1000;

  if (this.buser === null) {
    throw new Error('BUser not registered. Can\'t register profile');
  }

  // We prepare our object
  const profile = Schema.create.dapobject('profile');

  Object.assign(profile, {
    avatar,
    displayName,
    props,
    bio,
  });

  const stPacket = Schema.create.stpacket(profile, this.dapId, this.dapSchema);

  const transaction = new Dashcore.Transaction()
    .setType(Dashcore.Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION);

  const serializedPacket = Schema.serialize.encode(stPacket);
  const stPacketHash = doubleSha256(serializedPacket).toString('hex');

  const payload = transaction.extraPayload
    .setRegTxId(this.buser.regtxid)
    .setHashPrevSubTx(Array.from(this.buser.subtx).pop())
    .setHashSTPacket(stPacketHash)
    .setCreditFee(creditFeeSet)
    .sign(this.getBUserPrivateKey());

  // Attach payload to transaction object
  transaction
    .setExtraPayload(payload);


  const utxo = this.getUTXOS();
  const { address } = this.getUnusedAddress();

  const selection = utils.coinSelection(utxo, [{ address, satoshis: creditFeeSet }]);

  transaction
    .from([utxo])
    .to([{ address, satoshis: selection.utxosValue - creditFeeSet - selection.estimatedFee }]);


  const privateKeys = this.getPrivateKeys(
    selection.utxos
      .map(item => item.address)
      .map(hdpk => hdpk.privateKey),
  );

  const signedTransaction = transaction.sign(privateKeys, Dashcore.crypto.Signature.SIGHASH_ALL);
  const txid = await this.broadcastTransaction(signedTransaction.toString());
  console.log(`Profile ${displayName}  Registered (txid ${txid}.`);
  return txid;
};
