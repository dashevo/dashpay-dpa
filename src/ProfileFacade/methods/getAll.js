const Profile = require('../../Profile/Profile');
const overwriteProfile = require('../utils/overwriteProfile');

module.exports = async function getAll() {
  try {
    if (!this.transporter) throw new Error('Missing transporter or offlineMode active');

    const fetchOpts = {};
    const contractId = this.dpp.getContract()
      .getId();
    const profilesJSON = await this.transporter.fetchDocuments(contractId, 'profile', fetchOpts);
    const profiles = profilesJSON
      .map(profile => overwriteProfile(this, new Profile(profile)));

    return profiles;
  } catch (e) {
    throw e;
  }
};
