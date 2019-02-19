module.exports = async (transport, dapId, userRegTxId) => {
  return await transport.fetchDapObjects(dapId, 'contact', { blockchainUserId: userRegTxId });
};
