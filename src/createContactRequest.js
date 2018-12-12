const Schema       = require('@dashevo/dash-schema/dash-schema-lib');
const doubleSha256 = require('./utils/doubleSha256');

module.exports = async (dashcore, transport, dapId, privateKey, userRegTxId, prevStId) => {
  const contactRequest = Schema.create.dapobject('contact');
  contactRequest.hdextpubkey = privateKey.toPublicKey().toString('hex');
  contactRequest.relation = userRegTxId;
  contactRequest.act = 0;

  const { stpacket: stPacket } = Schema.create.stpacket();
  stPacket.dapobjects = [contactRequest];
  stPacket.dapid = dapId;

  const transaction = dashcore.Transaction().setType(Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION);
  const serializedPacket = Schema.serialize.encode(stPacket);
  const stPacketHash = doubleSha256(serializedPacket);

  transaction.extraPayload
    .setRegTxId(bobRegTxId)
    .setHashPrevSubTx(prevStId)
    .setHashSTPacket(stPacketHash)
    .setCreditFee(1000)
    .sign(privateKey);

  const transitionHash = await transport.sendRawTransition(
    transaction.serialize(),
    serializedPacket.toString('hex'),
  );

  return transitionHash;
};