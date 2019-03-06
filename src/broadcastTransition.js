module.exports = async function broadcastTransition(rawTransaction, rawTransactionPacket) {
  return this.transport.transport.sendRawTransition(
    rawTransaction,
    rawTransactionPacket,
  );
}