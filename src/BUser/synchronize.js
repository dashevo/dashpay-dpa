const BUserNotFoundError = require('../errors/BUserNotFoundError');
const STATES = require('./STATES');

module.exports = async function synchronize() {
  console.log('Trying to synchronize with network');
  if (!this.username) throw new Error('Missing Username');

  // The `.get` method is injected in BUserFacade.`create` method.
  try {
    const buserFromNetwork = await this.get(this.username);
    this.send(buserFromNetwork);
    if (this.regtxid) {
      // As soon as we got our regtxid, we can already register our contract and set it's userid.
      this.setDPP();
    }
    // Small special handling for from_mempool that doesn't get returned if false.
    const fromMempoolPropDisapeared = this.from_mempool && !buserFromNetwork.from_mempool;
    if (fromMempoolPropDisapeared) {
      this.from_mempool = false;
      delete this.from_mempool;
    }
    // if (this.from_mempool === true && !buserFromNetwork.from_mempool) delete this.from_mempool;
  } catch (e) {
    const isBUserNotFound = e.constructor.name === BUserNotFoundError.name;

    this.synchronizedLast = +new Date();
    if (isBUserNotFound) {
      this.state = STATES.AVAILABLE;
    } else {
      console.error(e);
      // throw e;
    }
  }
  // TODO : Ideally, synchronizing should, if existing, try with passed privateKey
  // and reset isOwned to false if not valid.
};
