const defaultOpts = {};

// function isStringInput(args) {
//   return args && args[0].constructor.name === String.name;
// }

function isObjectInput(args) {
  return args && args[0].constructor.name === Object.name;
}


class ContactRequest {
  // toJson, fromJson as called in constructor cannot be move to individual file
  constructor(...args) {
    if (args) {
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
  }

  toJSON() {
    const {} = this;
    const json = JSON.stringify({});
    return json;
  }
}

ContactRequest.prototype.send = require('./send');

module.exports = ContactRequest;
