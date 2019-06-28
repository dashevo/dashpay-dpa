// eslint-disable-next-line no-underscore-dangle
const _defaultOpts = {
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
    const defaultOpts = JSON.parse(JSON.stringify(_defaultOpts));
    this.publicKey = defaultOpts.publicKey;
    if (args && args[0] !== undefined) {
      if (args[0].constructor === Contact) {
        this.fromJSON(args[0].toJSON());
      }
      if (isObjectInput(args)) {
        this.fromJSON(args[0]);
      } else {
        console.log('Unsupported arg type for contact constructor');
      }
    }
  }

  fromJSON(json) {
    const obj = (json.constructor === String) ? JSON.parse(json) : json;
    if (obj.publicKey) {
      this.publicKey = obj.publicKey.toString();
    }
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
