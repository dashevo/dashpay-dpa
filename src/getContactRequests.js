module.exports = async (transport, dapId, userId) => {
  var a = await transport.fetchDapObjects(dapId, 'contact', { blockchainUserId: userId });
  var b = await transport.fetchDapObjects(dapId, 'user', { 'object.user': userId });
  return [a, b];
};
