// eslint-disable-next-line no-underscore-dangle
const _defaultOpts = {
  publicKey: null,
  toUserId: null,
  userId: null,
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
    this.toUserId = defaultOpts.toUserId;
    this.userId = defaultOpts.userId;
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
      this.toUserId = obj.toUserId.toString();
      this.userId = obj.userId.toString();
    }
    return this;
  }

  toJSON() {
    const { publicKey, toUserId,userId } = this;
    const json = JSON.stringify({
      publicKey,
      toUserId,
      userId
    });
    return json;
  }
}


module.exports = Contact;
