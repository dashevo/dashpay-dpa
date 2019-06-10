/* eslint-disable no-param-reassign */

const BUserNotFoundError = require('../errors/BUserNotFoundError');
const BUser = require('../BUser/BUser.js');
const { is } = require('../utils');

/**
 * BUser needs some function from Wallet-lib, theses are passed to BUserFacade via `this.parent`
 * We can use that to overwrite our BUser method.
 */
const overwritedBuser = (self, buser) => {
  // this method is used exclusively by the synchronize method.
  // We needed an already connected way to retrieve `get` a BUser, which is done by DPD already.
  buser.get = param => self.get(param);

  // This set is used exclusively in register.js
  // We need those due to the manipulation done in registration. Those are already
  // configured / synchronized methods present in Wallet-Lib.
  buser.getUnusedAddress = (...args) => self.parent.getUnusedAddress(...args);
  buser.getBalance = (...args) => self.parent.getBalance(...args);
  buser.getUTXOS = (...args) => self.parent.getUTXOS(...args);
  // We should only export the method `getFeatureHardenedPath` which is a todo for now.
  buser.keyChain = self.parent.keyChain;
  buser.getBUserSigningPrivateKey = (...args) => self.parent.getBUserSigningPrivateKey(...args);
  buser.getPrivateKeys = (...args) => self.parent.getPrivateKeys(...args);
  buser.broadcastTransaction = (...args) => self.parent.broadcastTransaction(...args);
  return buser;
};

class BUserFacade {
  constructor(transporter, parent) {
    if (transporter) {
      this.transporter = transporter;
    }
    this.parent = parent;
  }

  create(args) {
    const buser = overwritedBuser(this, new BUser(args));
    return buser;
  }

  async get(identifier) {
    if (!identifier) throw new Error('Expected valid identifier to be either Username or RegTxId');
    if (is.userid(identifier)) return this.getById(identifier);
    return this.getByUsername(identifier);
  }

  /**
   * @private
   */
  async getById(uid) {
    if (!uid) throw new Error('Missing UID parameter');
    try {
      if (!this.transporter) throw new Error('Missing transporter or offlineMode active');
      const buserJSON = await this.transporter.getUserById(uid);
      const buser = overwritedBuser(this, new BUser(buserJSON));
      return buser;
    } catch (e) {
      const isUserNotFoundError = new RegExp('user.*not.*found.*', 'g');
      if (isUserNotFoundError.test(e.message)) {
        throw new BUserNotFoundError(uid);
      } else {
        throw e;
      }
    }
  }

  /**
   * @private
   */
  async getByUsername(username) {
    if (!username) throw new Error('Missing Username parameter');
    try {
      if (!this.transporter) throw new Error('Missing transporter or offlineMode active');
      const buserJSON = await this.transporter.getUserByName(username);
      const buser = overwritedBuser(this, new BUser(buserJSON));
      return buser;
    } catch (e) {
      const isUserNotFoundError = new RegExp('user.*not.*found.*', 'g');
      if (isUserNotFoundError.test(e.message)) {
        throw new BUserNotFoundError(username);
      } else {
        throw e;
      }
    }
  }
}

module.exports = BUserFacade;
