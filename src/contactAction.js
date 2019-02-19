const { doubleSha256 } = require('./utils/crypto');
const Schema = require('@dashevo/dash-schema/dash-schema-lib');

const performActionFactory = action => async (dashcore, transport, walletOwnerUserId, dapId, privateKey, userRegTxId, prevStId) => {
  const dapObject = Schema.create.dapobject('contact');
  dapObject.hdextpubkey = privateKey.toPublicKey().toString('hex');
  dapObject.relation = userRegTxId;
  dapObject.act = action;

  const { stpacket: stPacket } = Schema.create.stpacket();
  stPacket.dapobjects = [dapObject];
  stPacket.dapid = dapId;

  const transaction = dashcore
    .Transaction()
    .setType(dashcore.Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION);
  const serializedPacket = Schema.serialize.encode(stPacket);
  const stPacketHash = doubleSha256(serializedPacket);

  transaction.extraPayload
    .setRegTxId(walletOwnerUserId)
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

exports.acceptContactRequest = performActionFactory();

exports.createContactRequest = performActionFactory(0);

exports.removeContact = performActionFactory(2);