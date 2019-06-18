const Profile = require('../Profile/Profile.js');

/**
 * Profile needs some function from Wallet-lib, theses are passed to ProfileFacade via `this.parent`
 * We can use that to overwrite our Profile method.
 */

/* eslint-disable no-param-reassign */
const overwritedProfile = (self, profile) => {
  profile.prepareStateTransition = (...args) => self.parent.prepareStateTransition(...args);
  profile.broadcastTransition = (...args) => self.parent.broadcastTransition(...args);

  return profile;
};

/* eslint-enable no-param-reassign */

class ProfileFacade {
  constructor(transporter, parent) {
    if (transporter) {
      this.transporter = transporter;
    }
    this.parent = parent;
  }

  create(args) {
    const buser = overwritedProfile(this, new Profile(args));
    return buser;
  }

  get() {
    if (!this.transporter) throw new Error('Transporter expected to get a profile');
    return null;
  }
}

module.exports = ProfileFacade;
