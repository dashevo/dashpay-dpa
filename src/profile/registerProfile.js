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

  profile.act = 0;
  Object.assign(profile, {
    // avatar,
    displayName,
    // props,
    bio,
  });

  const { stpacket: stPacket } = Schema.create.stpacket();
  stPacket.dapobjects = [profile];
  stPacket.dapid = this.dapId;

  // const stPacket = Schema.create.stpacket(profile);
  // console.log(stPacket);
  // stPacket.dapid = this.dapId;
  // stPacket.dapobjects = [profile];
  console.log(stPacket);
  const serializedPacket = Schema.serialize.encode(stPacket);
  const stPacketHash = doubleSha256(serializedPacket).toString('hex');

  const transaction = new Dashcore.Transaction()
    .setType(Dashcore.Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION);

  const hashPrevSubTx = (this.buser.subtx.length === 0)
    ? this.buser.regtxid
    : Array.from(this.buser.subtx).pop();

  const payload = transaction.extraPayload
    .setRegTxId(this.buser.regtxid)
    .setHashPrevSubTx(hashPrevSubTx)
    .setHashSTPacket(stPacketHash)
    .setCreditFee(creditFeeSet)
    .sign(this.getBUserPrivateKey().toString('hex'));

  // Attach payload to transaction object
  transaction
    .setExtraPayload(payload);

  const signedTransaction = transaction.sign(this.getBUserPrivateKey());

  // const txid = await this.broadcastTransition(
  //   signedTransaction.serialize(),
  //   serializedPacket.toString('hex'),
  // );

  console.log(`Profile ${displayName}  Registered (txid ${txid}.`);
  return txid;
};
