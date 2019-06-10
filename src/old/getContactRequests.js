module.exports = async function getContactRequests(transport, userId) {
  const a = await transport.fetchDocuments(this.dpp.getContract().getId(), 'contact', { blockchainUserId: userId });
  const b = await transport.fetchDocuments(this.dpp.getContract().getId(), 'user', { 'object.user': userId });
  return [a, b];
};
