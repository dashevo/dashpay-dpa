const STATES = require('./STATES');
const BUserAlreadyExistError = require('../errors/BUserAlreadyExistError');

function isStringInput(args) {
  return args && args[0].constructor.name === String.name;
}

function isObjectInput(args) {
  return args && args[0].constructor.name === Object.name;
}

const defaultOpts = {
  state: STATES.UNKNOWN,
  isOwned: false,
  synchronizedLast: null,
};

class BUser {
  constructor(...args) {
    this.state = defaultOpts.state;
    this.isOwned = defaultOpts.isOwned;
    this.synchronizedLast = defaultOpts.synchronizedLast;
    if (args.length > 0) {
      if (isStringInput(args)) {
        return this.fromUsername(args[0]);
      }
      if (isObjectInput(args)) {
        return this.fromJSON(args[0]);
      }
    }
  }

  canRegister() {
    if (!this.username) throw new Error('Missing username.');
    if (!this.isOwned) throw new Error('You need to own the BUser first (try passing pkey to \'own\')');
    if (this.state === STATES.UNKNOWN) throw new Error('You need to `synchronize()`. State UNKNOWN');
    if (this.state === STATES.OPEN) throw new BUserAlreadyExistError(this.username);
    return this.isOwned && this.state === STATES.AVAILABLE;
  }

  own(privateKey) {
    console.log('Owning the BUser with privatekey', privateKey.toString());
    this.privateKey = privateKey.toString();
    // Todo : Either here or on synchronize method, we should actually test if that is a
    // valid key :)
    this.isOwned = true;
  }
}

BUser.prototype.register = require('./register');
BUser.prototype.synchronize = require('./synchronize');
BUser.prototype.toJSON = require('./toJSON');
BUser.prototype.fromJSON = require('./fromJSON');
BUser.prototype.fromUsername = require('./fromUsername');

module.exports = BUser;
