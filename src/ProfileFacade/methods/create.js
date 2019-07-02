const Profile = require('../../Profile/Profile');
const overwriteProfile = require('../utils/overwriteProfile');

module.exports = function create(arg) {
  const profile = overwriteProfile(this, new Profile(arg));
  return profile;
};
