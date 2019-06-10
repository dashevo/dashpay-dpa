const Dashcore = require('@dashevo/dashcore-lib');

module.exports = async function registerSchema(buser, signingKey) {
  const creditFeeSet = 1000;

  const { dapContract, dpp } = this;

  const stPacket = dpp.packet.create(dpp.getContract());

  const transaction = new Dashcore.Transaction()
    .setType(Dashcore.Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION);

  const hashPrevSubTx = (buser.subtx.length === 0)
    ? this.buser.regtxid
    : Array.from(buser.subtx).pop();

  const payload = transaction.extraPayload
    .setRegTxId(buser.regtxid)
    .setHashPrevSubTx(hashPrevSubTx)
    .setHashSTPacket(stPacket.hash())
    .setCreditFee(creditFeeSet)
    .sign(signingKey.getBUserPrivateKey().toString('hex'));

  // Attach payload to transaction object
  transaction
    .setExtraPayload(payload);


  // Attach payload to transaction object
  transaction
    .setExtraPayload(payload);

  const signedTransaction = transaction.sign(signingKey);

  const txid = await this.broadcastTransition(
    signedTransaction.serialize(),
    stPacket.serialize().toString('hex'),
  );

  console.log(`DAP ${dapContract.dapcontract.dapname} Registered (txid ${txid}.`);
  return txid;
};
