module.exports = async function searchBUsers(pattern = '*') {
  return this.transport.transport.searchUsers(pattern);
};
