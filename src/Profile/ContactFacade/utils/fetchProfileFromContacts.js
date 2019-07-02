
const { map } = require('lodash');


async function getProfileOwnerOfContact(contact, profile) {
  console.log(contact);

  // Which ideally should be a profileId... Here we will just guess which one is the BUser (1rst)
  const pubKeyId = contact.userId;
  return profile.getByPubKeyId(pubKeyId)



  // We lookup for profile with same pubKeyId



  // return profile.getByPubKeyId(pubkey)
  // const contractId = this.dpp.getContract()
  //   .getId();
  // const profileJSON = await this.transporter.fetchDocuments(contractId, 'profile', fetchOpts);
  // if (profileJSON.length === 0) {
  //   return null;
  // }
  // return profileJSON.map(profile => overwritedProfile(this, new Profile(profile)));
}


// FIXME : So that is the things, due to our ProfileFacade (where we could get profile easily) being
// Unnaccessible from a Profile itself (because it does create it), and unnaccessible
// from Contact as Contact are created by relation with a Profile.
// Therefore we kinda reimplements it here... it's not good.
module.exports = async function fetchProfileFromContacts(contacts, profile) {
  // const profiles = [];

  console.log(profile);
  const profiles = await Promise
    .all(map(contacts, async contact => profile.getByUserId(contact.userId)));

  // await Promise.all(each(contacts, async (contact) => {
  // const profile = await profileFacade.get(contact.publicKey);
  // profiles.push(profile);
  // }));
  console.log(profiles);
  return profiles;
  // console.log('Contacts fetchProfileFromContacts', contacts);
  // console.log(profileFacade)
  // profileFacade.
};
