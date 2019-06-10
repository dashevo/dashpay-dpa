const StdError = require('./StdError');

class BUserAlreadyExistError extends StdError {
  constructor(busername) {
    const getErrorMessageOf = (_busername) => {
      return `User ${_busername} already exist on the network. Cannot register.`;
    };
    super(getErrorMessageOf(busername));
  }
}
module.exports = BUserAlreadyExistError;
