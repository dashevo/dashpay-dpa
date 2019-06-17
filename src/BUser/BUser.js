const STATES = require('./STATES');


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
}

BUser.prototype.canRegister = require('./canRegister');
BUser.prototype.register = require('./register');
BUser.prototype.own = require('./own');
BUser.prototype.synchronize = require('./synchronize');
BUser.prototype.toJSON = require('./toJSON');
BUser.prototype.setDPP = require('./setDPP');
BUser.prototype.fromJSON = require('./fromJSON');
BUser.prototype.fromUsername = require('./fromUsername');

module.exports = BUser;
