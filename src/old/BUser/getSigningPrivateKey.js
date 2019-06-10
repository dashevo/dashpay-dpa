module.exports = function getBUserSigningPrivateKey() {
  // Full path on testnet will be : m/44'/1'/5/0/0
  return this.privateKey
    .deriveChild(5)
    .deriveChild(0)
    .deriveChild(0)
    .privateKey;
};
