const ProfileNotFoundError = require('../errors/ProfileNotFoundError');

const Profile = require('../Profile/Profile.js');
const { is } = require('../utils');

/**
 * Profile needs some function from Wallet-lib, theses are passed to ProfileFacade via `this.parent`
 * We can use that to overwrite our Profile method.
 */

/* eslint-disable no-param-reassign */
const overwritedProfile = (self, profile) => {
  const {
    prepareStateTransition,
    broadcastTransition,
    sendRawTransition,
  } = self.importedMethods;
  const { transporter } = self;

  profile.prepareStateTransition = (...args) => prepareStateTransition.call({ transporter }, ...args);
  profile.broadcastTransition = (...args) => broadcastTransition.call({ transporter }, ...args);
  profile.sendRawTransition = sendRawTransition;


  return profile;
};

/* eslint-enable no-param-reassign */

class ProfileFacade {
  constructor(transporter, dpp, importedMethods) {
    if (transporter) {
      this.transporter = transporter;
    }
    this.importedMethods = importedMethods;
    this.dpp = dpp;
  }

  create(args) {
    const profile = overwritedProfile(this, new Profile(args));
    return profile;
  }

  async get(identifier) {
    if (!identifier) throw new Error('Expected valid identifier to be a profileID');
    if (!this.transporter) throw new Error('Transporter expected to get a profile');

    if (is.profileid(identifier)) return this.getById(identifier);
    return this.getByProfilename(identifier);
  }


  async getByUserId(uid) {
    if (!uid) throw new Error('Missing UID parameter');
    try {
      if (!this.transporter) throw new Error('Missing transporter or offlineMode active');

      console.log(this);

      const fetchOpts = { where: { userId: uid } };
      const contractId = this.dpp.getContract()
        .getId();
      const profileJSON = await this.transporter.fetchDocuments(contractId, 'profile', fetchOpts);
      if (profileJSON.length === 0) {
        return null;
      }
      if (profileJSON.length > 1) {
        return profileJSON.map((el) => {
          // eslint-disable-next-line no-param-reassign
          el.avatar = el.avatarUrl;
          // eslint-disable-next-line no-param-reassign
          el.bio = el.about;
          return overwritedProfile(this, new Profile(el));
        });
      } else {
        profileJSON[0].avatar = profileJSON[0].avatarUrl;
        // eslint-disable-next-line no-param-reassign
        profileJSON[0].bio = profileJSON[0].about;
        const profile = overwritedProfile(this, new Profile(profileJSON[0]));
        return profile;
      }

    } catch (e) {
      throw e;
    }
  }

  /**
   * @private
   */
  async getById(pid) {
    if (!pid) throw new Error('Missing UID parameter');
    try {
      if (!this.transporter) throw new Error('Missing transporter or offlineMode active');

      console.log(this);

      const fetchOpts = { where: { _id: pid } };
      const contractId = this.dpp.getContract()
        .getId();
      console.log(fetchOpts);
      const profileJSON = await this.transporter.fetchDocuments(contractId, 'profile', {});
      console.log(profileJSON);
      return null;

      console.log('PROFILEJSON');
      console.log(profileJSON);
      const profile = overwritedProfile(this, new Profile(profileJSON));
      return profile;
    } catch (e) {
      const isUserNotFoundError = new RegExp('user.*not.*found.*', 'g');
      if (isUserNotFoundError.test(e.message)) {
        throw new ProfileNotFoundError(uid);
      } else {
        throw e;
      }
    }
  }

  getByProfilename(profileName) {
    if (!profileName) throw new Error('Missing profileName parameter');
    return null;
  }
}

module.exports = ProfileFacade;
