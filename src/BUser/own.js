const { PrivateKey, util } = require('@dashevo/dashcore-lib');

module.exports = function own(_privateKey) {
  console.log('Owning the BUser with privatekey', _privateKey.toString());
  const privateKey = (typeof _privateKey === 'string')
    ? new PrivateKey(_privateKey)
    : _privateKey;


  // eslint-disable-next-line no-underscore-dangle
  const pubkeyid = util.buffer.copy(privateKey.toPublicKey()
    ._getID()).reverse().toString('hex');
  if (this.pubkeyid && this.pubkeyid !== pubkeyid) {
    console.error(`Mismatch pubkeyid. Expected ${this.pubkeyid} got: ${pubkeyid}`);
    throw new Error('Invalid privateKey for this buser. Cannot own');
  } else {
    console.log('Own without being able to verify. Sync before owning to get verification.');
  }
  this.privateKey = privateKey.toString();
  this.isOwned = true;
};
