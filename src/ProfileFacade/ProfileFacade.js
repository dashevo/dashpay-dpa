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
  constructor(transporter, dpp, buserFacade, importedMethods) {
    if (transporter) {
      this.transporter = transporter;
    }
    this.buserFacade = buserFacade;
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
      return profileJSON.map((el) => {
        // eslint-disable-next-line no-param-reassign
        el.avatar = el.avatarUrl;
        // eslint-disable-next-line no-param-reassign
        el.bio = el.about;
        return overwritedProfile(this, new Profile(el));
      });
    } catch (e) {
      throw e;
    }
  }

  async getAll() {
    try {
      if (!this.transporter) throw new Error('Missing transporter or offlineMode active');

      const fetchOpts = {};
      const contractId = this.dpp.getContract()
        .getId();
      const profilesJSON = await this.transporter.fetchDocuments(contractId, 'profile', fetchOpts);

      const profiles = profilesJSON.map((profile) => {
        // eslint-disable-next-line no-param-reassign
        profile.bio = profile.about;
        // eslint-disable-next-line no-param-reassign
        profile.avatar = profile.avatarUrl;
        return overwritedProfile(this, new Profile(profile));
      });

      return profiles;
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
      const profileJSON = await this.transporter.fetchDocuments(contractId, 'profile', fetchOpts);
      const profile = overwritedProfile(this, new Profile(profileJSON));
      return profile;
    } catch (e) {
      throw e;
    }
  }

  async getByBUser(buser) {
    if (buser && buser.regtxid) {
      return this.getByUserId(buser.regtxid);
    }
    return false;
  }

  async getByBUsername(busername) {
    const buser = await this.buserFacade.get(busername);
    if (buser) {
      return this.getByBUser(buser);
    }
    return false;
  }

  getByDisplayName(profileName) {
    if (!profileName) throw new Error('Missing profileName parameter');
    return null;
  }
}

module.exports = ProfileFacade;
