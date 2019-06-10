const Profile = require('../Profile/Profile.js');

/**
 * Profile needs some function from Wallet-lib, theses are passed to ProfileFacade via `this.parent`
 * We can use that to overwrite our Profile method.
 */
const overwritedProfile = (self, profile) => {
  profile.getBUserSigningPrivateKey = (...args) => self.parent.getBUserSigningPrivateKey(...args);
  profile.prepareStateTransition = (...args) => self.parent.prepareStateTransition(...args);
  profile.broadcastTransition = (...args) => self.parent.broadcastTransition(...args);

  return profile;
};

/* eslint-disable no-param-reassign */
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

}

module.exports = ProfileFacade;
