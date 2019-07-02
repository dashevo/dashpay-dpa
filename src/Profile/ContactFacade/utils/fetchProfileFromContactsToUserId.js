const { map } = require('lodash');


// FIXME : So that is the things, due to our ProfileFacade (where we could get profile easily) being
// Unnaccessible from a Profile itself (because it does create it), and unnaccessible
// from Contact as Contact are created by relation with a Profile.
// Therefore we kinda reimplements it here... it's not good.
module.exports = async function fetchProfileFromContactsToUserId(contacts, profile) {
  const profiles = await Promise.all(map(contacts, async (contact) => {
    const profilesOfContact = await profile.getByUserId(contact.toUserId);
    return profilesOfContact[0];
  }));
  return profiles;
};
