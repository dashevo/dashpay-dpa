const Dashcore = require('@dashevo/dashcore-lib');

const prepareStateTransition = function (object, buser, privKey) {
  const creditFeeSet = 1000;
  const stPacket = this.dpp.packet.create(this.dpp.getContract());

  const transaction = new Dashcore.Transaction()
    .setType(Dashcore.Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION);

  const hashPrevSubTx = (buser.subtx.length === 0)
    ? buser.regtxid
    : Array.from(buser.subtx).pop();

  const payload = transaction.extraPayload
    .setRegTxId(buser.regtxid)
    .setHashPrevSubTx(hashPrevSubTx)
    .setHashSTPacket(stPacket.hash())
    .setCreditFee(creditFeeSet)
    .sign(privKey);

  // Attach payload to transaction object
  transaction
    .setExtraPayload(payload);

  const signedTransaction = transaction.sign(privKey);

  return {
    serializedTransaction: signedTransaction.serialize(),
    serializedPacket: stPacket.serialize().toString('hex'),
  };
};
module.exports = prepareStateTransition;
