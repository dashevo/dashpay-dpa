const Dashcore = require('@dashevo/dashcore-lib');
const DashPlatformProtocol = require('@dashevo/dpp');
const dpp = new DashPlatformProtocol();
const { doubleSha256 } = require('./utils/crypto.js');

const prepareStateTransition = function (object, buser, privKey) {
  const creditFeeSet = 1000;
  const { stpacket: stPacket } = dpp.document.create();
  stPacket.dapobjects = [object];
  stPacket.dapid = this.dapId;

  const serializedPacket = Schema.serialize.encode(stPacket);
  const stPacketHash = doubleSha256(serializedPacket).toString('hex');

  const transaction = new Dashcore.Transaction()
    .setType(Dashcore.Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION);

  const hashPrevSubTx = (buser.subtx.length === 0)
    ? buser.regtxid
    : Array.from(buser.subtx).pop();

  const payload = transaction.extraPayload
    .setRegTxId(buser.regtxid)
    .setHashPrevSubTx(hashPrevSubTx)
    .setHashSTPacket(stPacketHash)
    .setCreditFee(creditFeeSet)
    .sign(privKey);

  // Attach payload to transaction object
  transaction
    .setExtraPayload(payload);

  const signedTransaction = transaction.sign(privKey);

  return {
    serializedTransaction: signedTransaction.serialize(),
    serializedPacket: serializedPacket.toString('hex'),
  };
};
module.exports = prepareStateTransition;
