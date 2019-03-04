const { doubleSha256 } = require('./utils/crypto');
const Schema = require('@dashevo/dash-schema/dash-schema-lib');

const createSerializedPacketHash = data => {
  const { stpacket: stPacket } = Schema.create.stpacket();
  return Schema.serialize.encode(Object.assign(stPacket, data));
}

const performActionFactory = action => async (dashcore, transport, dapId, privateKey, userRegTxId, prevStId, recipientUserId) => {
  const dapObject = Schema.create.dapobject('contact');
  dapObject.hdextpubkey = privateKey.toPublicKey().toString('hex');
  dapObject.relation = recipientUserId;
  dapObject.act = action;

  const serializedPacket = createSerializedPacketHash({
    dapobjects: [dapObject],
    dapid: dapId
  });

  const stPacketHash = doubleSha256(serializedPacket).toString('hex');

  const transaction = dashcore
    .Transaction()
    .setType(dashcore.Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION)
    .extraPayload
    .setRegTxId(userRegTxId)
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