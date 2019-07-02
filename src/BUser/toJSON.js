module.exports = function toJSON() {
  return Object.getOwnPropertyNames(this)
    .filter((a) => {
      if ([
        'state',
        'isOwned',
        'synchronizedLast',
        'username',
        'privateKey',
        'regtxid',
        'pubkeyid',
        'credits',
        'subtx',
        'data',
        'from_mempool',
      ].includes(a)) {
        return true;
      }
      return false;
    })
    .reduce((a, b) => {
      // eslint-disable-next-line no-param-reassign
      a[b] = this[b];
      return a;
    }, {});
};
