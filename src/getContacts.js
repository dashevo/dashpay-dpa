module.exports = async (transport, dapId) => {
  return await transport.fetchDapObjects(dapId, 'user', { type: 'contact' });
};
