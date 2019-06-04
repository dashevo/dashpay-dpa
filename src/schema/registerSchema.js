const Dashcore = require('@dashevo/dashcore-lib');

const { doubleSha256 } = require('../utils/crypto.js');

module.exports = async function registerSchema() {
  const creditFeeSet = 1000;

  const { dapContract } = this;
  const dapid = this.dapId;
  console.log(`DAP ID : ${dapid}`);

  // We prepare our state transition
  const dapName = 'dashdpaporto';
  const stPacket = this.dpp.contract.create(dapName, dapContract);

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
