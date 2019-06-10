const setters = require('./_setters');

module.exports = function fromUsername(username) {
  setters.setUsername.call(this, username);
};
