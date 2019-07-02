module.exports = async function broadcastTransition(rawTransaction, rawTransactionPacket) {
  return this.transporter.sendRawTransition(
    rawTransaction,
    rawTransactionPacket,
  );
};
