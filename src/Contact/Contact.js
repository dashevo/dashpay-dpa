const defaultOpts = {
  publicKey: null,
};

// function isStringInput(args) {
//   return args && args[0].constructor.name === String.name;
// }

function isObjectInput(args) {
  return args && args[0].constructor.name === Object.name;
}


class Contact {
  constructor(...args) {
    this.publicKey = defaultOpts.publicKey;
    if (args && args[0] !== null) {
      if (args[0].constructor === Contact) {
        this.fromJSON(args[0].toJSON());
      }
      if (isObjectInput(args)) {
        this.fromJSON(args[0]);
      }
    }
  }

  fromJSON(json) {
    const obj = (json.constructor === String) ? JSON.parse(json) : json;
    if (obj.publicKey) this.publicKey = obj.publicKey;
    return this;
  }

  toJSON() {
    const { publicKey } = this;
    const json = JSON.stringify({
      publicKey,
    });
    return json;
  }
}


module.exports = Contact;
