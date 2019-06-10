const { Transaction } = require('@dashevo/dashcore-lib');

module.exports = function prepareStateTransition(object, buser, privKey) {
  // console.log(object);
  // console.log(buser);
  // console.log(privKey);

  const creditFeeSet = 1000;
  const { dpp } = buser;
  console.log(object);
  const stPacket = dpp.packet.create([object]);

  const transaction = new Transaction()
    .setType(Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION);

  const hashPrevSubTx = (buser.subtx.length === 0)
    ? buser.regtxid
    : Array.from(buser.subtx)
      .pop();

  console.log(buser.regtxid);
  console.log(hashPrevSubTx);
  // console.log(stPacket.hash());
  // console.log(creditFeeSet);
  // console.log(privKey);

  transaction.extraPayload
    .setRegTxId(buser.regtxid)
    .setHashPrevSubTx(hashPrevSubTx)
    .setHashSTPacket(stPacket.hash())
    .setCreditFee(creditFeeSet)
    .sign(privKey);

  return {
    serializedTransaction: transaction.serialize(),
    serializedPacket: stPacket.serialize()
      .toString('hex'),
  };
};
