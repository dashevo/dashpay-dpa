const getSigningPrivateKey = require('./getSigningPrivateKey');

/**
 * @param json - JSON representation of a BUser
 * @param username - Username of BUser
 * @param privateKey - PrivateKey for signing ST of the BUSer
 */
class BUser {
  constructor(...args) {
    this.username = null;
    this.privateKey = null;

    this.regtxid = null;
    this.pubkeyid = null;
    this.credits = null;
    this.data = null;
    this.state = null;
    this.subtx = null;

    if (args.length > 0) {
      if (args[0].constructor.name === String.name) {
        this.setUsername(args[0]);
        if (args[1]) this.setPrivateKey(args[1]);
      } else if (args[0].constructor.name === Object.name) {
        this.fromJSON(args[0]);
      }
    }
  }

  setRegTxId(regtxid) {
    this.regtxid = regtxid;
  }

  setPrivateKey(pk) {
    this.privateKey = pk;
  }

  setUsername(uname) {
    this.username = uname;
  }

  toJSON() {
    const {
      username, regtxid, pubkeyid, credits, data, state, subtx,
    } = this;

    return {
      username,
      regtxid,
      pubkeyid,
      credits,
      data,
      state,
      subtx,
    };
  }

  fromJSON(json) {
    this.username = json.uname;
    this.regtxid = json.regtxid;
    this.pubkeyid = json.pubkeyid;
    this.credits = json.credits;
    this.data = json.data;
    this.state = json.state;
    this.subtx = json.subtx;
  }

  synchronize() {
    if (this.username) {

    } else if (this.regtxid) {

    } else {
      throw new Error('Cannot synchronize, missing a Username or RegTxId');
    }
  }
}

BUser.prototype.getSigningPrivateKey = getSigningPrivateKey;

module.exports = BUser;
