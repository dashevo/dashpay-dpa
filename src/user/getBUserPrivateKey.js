module.exports = function getBUserPrivateKey() {
  // TODO : Are we sure for this path ?
  return this.keyChain.getKeyForPath('m/2/0').privateKey;
};
