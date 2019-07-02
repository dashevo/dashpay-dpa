// eslint-disable-next-line no-underscore-dangle
const _defaultOpts = {
  about: '',
  avatarUrl: 'http://api.adorable.io/avatars/285/profile@dashevo.png',
  $meta: { userId: null },
};

const ContactFacade = require('./ContactFacade/ContactFacade');
const ContactRequestFacade = require('./ContactRequestFacade/ContactRequestFacade');
// function isStringInput(args) {
//   return args && args[0].constructor.name === String.name;
// }

function isObjectInput(args) {
  return args && args[0].constructor.name === Object.name;
}


class Profile {
  constructor(...args) {
    const defaultOpts = JSON.parse(JSON.stringify(_defaultOpts));
    this.about = defaultOpts.about;
    this.avatarUrl = defaultOpts.avatarUrl;
    this.$meta = defaultOpts.$meta;
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
    if (obj.about) this.about = obj.about;
    if (obj.avatarUrl) this.avatarUrl = obj.avatarUrl;
    if (obj.$meta) this.$meta = obj.$meta;
  }

  toJSON() {
    const { avatarUrl, about, $meta } = this;
    const json = JSON.stringify({
      about,
      avatarUrl,
      $meta,
    });
    return json;
  }


  setOwner(buser) {
    this.buser = buser;
    if (!this.buser.dpp) {
      this.buser.setDPP();
    }
    const {
      transporter, broadcastTransition, sendRawTransition, prepareStateTransition,
    } = this.buser;
    this.contact = new ContactFacade(transporter, this, { broadcastTransition });

    this.contactRequest = new ContactRequestFacade(transporter, this, {
      contact: this.contact,
      broadcastTransition,
      sendRawTransition,
      prepareStateTransition,
    });
  }
}

Profile.prototype.setDPP = require('./setDPP');
Profile.prototype.register = require('./register');

module.exports = Profile;
