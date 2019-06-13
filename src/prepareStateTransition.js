const { Transaction } = require('@dashevo/dashcore-lib');

module.exports = function prepareStateTransition(object, buser, privKey) {
  const creditFeeSet = 1000;
  const { dpp } = buser;
  const stPacket = dpp.packet.create([object]);

  const transaction = new Transaction()
    .setType(Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION);

  const hashPrevSubTx = (buser.subtx.length === 0)
    ? buser.regtxid
    : Array.from(buser.subtx)
      .pop();

  transaction.extraPayload
    .setRegTxId(buser.regtxid)
    .setHashPrevSubTx(hashPrevSubTx)
    .setHashSTPacket(stPacket.hash())
    .setCreditFee(creditFeeSet)
    .sign(privKey);

  console.log('STPacket ContractID', stPacket.getContractId());

  return {
    serializedTransaction: transaction.serialize(),
    serializedPacket: stPacket.serialize()
      .toString('hex'),
  };
};
