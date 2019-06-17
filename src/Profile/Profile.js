const defaultOpts = {
  avatar: '',
  bio: '',
};

// function isStringInput(args) {
//   return args && args[0].constructor.name === String.name;
// }

function isObjectInput(args) {
  return args && args[0].constructor.name === Object.name;
}


class Profile {
  constructor(...args) {
    this.avatar = defaultOpts.avatar;
    this.bio = defaultOpts.bio;
    if (args && args[0] !== null) {
      if (args[0].constructor === Profile) {
        this.fromJSON(args[0].toJSON());
      }
      if (isObjectInput(args)) {
        this.fromJSON(args[0]);
      }
    }
  }

  fromJSON(json) {
    const obj = (json.constructor === String) ? JSON.parse(json) : json;
    if (obj.avatar) this.avatar = obj.avatar;
    if (obj.bio) this.bio = obj.bio;
  }

  toJSON() {
    const { avatar, bio } = this;
    const json = JSON.stringify({
      avatar,
      bio,
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


module.exports = Profile;
