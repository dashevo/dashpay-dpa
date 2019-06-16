const defaultOpts = {};

// function isStringInput(args) {
//   return args && args[0].constructor.name === String.name;
// }

function isObjectInput(args) {
  return args && args[0].constructor.name === Object.name;
}


class Contact {
  constructor(...args) {
    if (args) {
      if (args[0].constructor === Contact) {
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


module.exports = Contact;
