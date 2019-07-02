const BUserAlreadyExistError = require('../errors/BUserAlreadyExistError');
const STATES = require('./STATES');

module.exports = function canRegister() {
  if (!this.username) throw new Error('Missing username.');
  if (!this.isOwned) throw new Error('You need to own the BUser first (try passing pkey to \'own\')');
  if (this.state === STATES.UNKNOWN) throw new Error('You need to `synchronize()`. State UNKNOWN');
  if (this.state === STATES.OPEN) throw new BUserAlreadyExistError(this.username);
  return this.isOwned && this.state === STATES.AVAILABLE;
};
