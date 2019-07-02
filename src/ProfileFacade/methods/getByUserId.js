const { map } = require('lodash');
const Profile = require('../../Profile/Profile');
const overwriteProfile = require('../utils/overwriteProfile');

module.exports = async function getByUserId(regtxid) {
  if (!regtxid) throw new Error('Missing UID parameter');
  try {
    if (!this.transporter) throw new Error('Missing transporter or offlineMode active');

    const fetchOpts = { where: { userId: regtxid } };
    const contractId = this.dpp.getContract()
      .getId();
    const profileJSON = await this.transporter.fetchDocuments(contractId, 'profile', fetchOpts);
    if (profileJSON.length === 0) {
      return null;
    }
    return Promise
      .all(map(profileJSON, async profile => overwriteProfile(this, new Profile(profile))));
  } catch (e) {
    throw e;
  }
};
