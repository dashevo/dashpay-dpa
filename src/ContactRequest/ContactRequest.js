const STATES = require('./STATES');

const defaultOpts = {
  receiver: null,
  sender: null,
  state: STATES.UNKNOWN,
};

// function isStringInput(args) {
//   return args && args[0].constructor.name === String.name;
// }

function isObjectInput(args) {
  return args && args[0].constructor.name === Object.name;
}


class ContactRequest {
  // toJson, fromJson as called in constructor cannot be move to individual file
  constructor(...args) {
    this.receiver = defaultOpts.receiver;
    this.sender = defaultOpts.sender;
    this.state = defaultOpts.state;
    if (args && args[0] !== null) {
      if (args[0].constructor === ContactRequest) {
        this.fromJSON(args[0].toJSON());
      }
    }
    if (isObjectInput(args)) {
      this.fromJSON(args[0]);
    }
  }

  fromJSON(json) {
    const obj = (json.constructor === String) ? JSON.parse(json) : json;
    if (obj.receiver) this.receiver = obj.receiver;
    if (obj.sender) this.sender = obj.sender;
    if (obj.state) this.state = obj.state;
  }

  toJSON() {
    const { receiver, sender, state } = this;
    const json = JSON.stringify({
      receiver,
      sender,
      state,
    });
    return json;
  }
}

ContactRequest.prototype.send = require('./send');

module.exports = ContactRequest;
