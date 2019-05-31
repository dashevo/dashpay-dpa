module.exports = async (transport, dapId, userId) => {
  const a = await transport.fetchDapObjects(dapId, 'contact', { blockchainUserId: userId });
  const b = await transport.fetchDapObjects(dapId, 'user', { 'object.user': userId });
  return [a, b];
};
