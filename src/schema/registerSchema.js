const Dashcore = require('@dashevo/dashcore-lib');
const Schema = require('@dashevo/dash-schema/dash-schema-lib');
const { doubleSha256 } = require('../utils/crypto.js');
const dapschema = require('../schema/dashpay.schema');
const { utils } = require('@dashevo/wallet-lib');

module.exports = async function registerSchema() {
  const creditFeeSet = 1000;

  const dapContract = this.dapContract;
  const dapid = this.dapId;
  console.log(`DAP ID : ${dapid}`);

  // We prepare our state transition
  const stPacket = Schema.create.stpacket(dapContract);

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


  // Attach payload to transaction object
  transaction
    .setExtraPayload(payload);

  const signedTransaction = transaction.sign(this.getBUserPrivateKey());

  const txid = await this.broadcastTransition(
    signedTransaction.serialize(),
    serializedPacket.toString('hex'),
  );

  console.log(`DAP ${dapContract.dapcontract.dapname} (ID:${dapid}) Registered (txid ${txid}.`);
  return txid;
};

//
// async registerSchema(regTxId, regTxPrivKey, prevStId) {
//   let { stpacket: stPacket } = Schema.create.stpacket();
//   stPacket = Object.assign(stPacket, this.dapContract);
//
//   const transaction = new Dashcore.Transaction()
//     .setType(Dashcore.Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION);
//
//   const serializedPacket = Schema.serialize.encode(stPacket);
//   const stPacketHash = doubleSha256(serializedPacket).toString('hex');
//
//   console.log(`DAP ${this.dapContract.dapcontract.dapname} (ID:${this.dapId}) Registered.`);
//
//   transaction.extraPayload
//     .setRegTxId(regTxId)
//     .setHashPrevSubTx(prevStId)
//     .setHashSTPacket(stPacketHash)
//     .setCreditFee(1000)
//     .sign(regTxPrivKey);
//
//   const txid = await this.broadcastTransition(transaction.serialize(), serializedPacket.toString('hex'));
//   return txid;
// }