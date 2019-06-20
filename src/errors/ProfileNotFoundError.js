const StdError = require('./StdError');

class ProfileNotFoundError extends StdError {
  constructor(pusername) {
    const getErrorMessageOf = _pusername => `User ${_pusername} not found on the network.`;
    super(getErrorMessageOf(pusername));
  }
}

module.exports = ProfileNotFoundError;
