const Profile = require('../../Profile/Profile')
const overwriteProfile = require('../utils/overwriteProfile')

module.exports = async function getById(pid) {
  if (!pid) throw new Error('Missing UID parameter');
  try {
    if (!this.transporter) throw new Error('Missing transporter or offlineMode active');

    const fetchOpts = { where: { _id: pid } };
    const contractId = this.dpp.getContract()
      .getId();
    const profilesJSON = await this.transporter.fetchDocuments(contractId, 'profile', fetchOpts);

    const profiles = profilesJSON.map(profile => overwriteProfile(this, new Profile(profile)));

    return profiles;
  } catch (e) {
    throw e;
  }
};
