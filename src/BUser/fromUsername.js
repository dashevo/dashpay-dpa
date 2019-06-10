const _setters = require('./_setters');

module.exports = function fromUsername(username) {
  _setters.setUsername.call(this, username);
};
