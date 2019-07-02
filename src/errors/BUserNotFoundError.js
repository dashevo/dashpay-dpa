const StdError = require('./StdError');

class BUserNotFoundError extends StdError {
  constructor(busername) {
    const getErrorMessageOf = _busername => `User ${_busername} not found on the network.`;
    super(getErrorMessageOf(busername));
  }
}

module.exports = BUserNotFoundError;
