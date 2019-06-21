// eslint-disable-next-line no-underscore-dangle
const _defaultOpts = {
  avatar: '',
  bio: '',
  displayName: '',
};

// function isStringInput(args) {
//   return args && args[0].constructor.name === String.name;
// }

function isObjectInput(args) {
  return args && args[0].constructor.name === Object.name;
}


class Profile {
  constructor(...args) {
    const defaultOpts = JSON.parse(JSON.stringify(_defaultOpts));
    this.avatar = defaultOpts.avatar;
    this.bio = defaultOpts.bio;
    this.displayUsername = defaultOpts.displayUsername;
    if (args && args[0] !== undefined) {
      if (args[0].constructor === Profile) {
        this.fromJSON(args[0].toJSON());
      }
      if (isObjectInput(args)) {
        this.fromJSON(args[0]);
      }
    }
    this.setDPP();
  }

  fromJSON(json) {
    const obj = (json.constructor === String) ? JSON.parse(json) : json;
    if (obj.avatar) this.avatar = obj.avatar;
    if (obj.bio) this.bio = obj.bio;
    if (obj.displayName) this.displayName = obj.displayName;
  }

  toJSON() {
    const { avatar, bio, displayName } = this;
    const json = JSON.stringify({
      avatar,
      bio,
      displayName,
    });
    return json;
  }


  setOwner(buser) {
    this.buser = buser;
    if (!this.buser.dpp) {
      console.error('Missing DPP for this BUser. Creating it.');
      this.buser.setDPP();
    }
  }
}

Profile.prototype.setDPP = require('./setDPP');
Profile.prototype.register = require('./register');

module.exports = Profile;
