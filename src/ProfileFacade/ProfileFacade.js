const Profile = require('../Profile/Profile.js');

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

  profile.prepareStateTransition = prepareStateTransition;
  profile.broadcastTransition = (...args) => broadcastTransition.call({ transporter }, ...args);
  profile.sendRawTransition = sendRawTransition;


  return profile;
};

/* eslint-enable no-param-reassign */

class ProfileFacade {
  constructor(transporter, importedMethods) {
    if (transporter) {
      this.transporter = transporter;
    }
    this.importedMethods = importedMethods;
  }

  create(args) {
    const profile = overwritedProfile(this, new Profile(args));
    return profile;
  }

  get() {
    if (!this.transporter) throw new Error('Transporter expected to get a profile');
    return null;
  }
}

module.exports = ProfileFacade;
