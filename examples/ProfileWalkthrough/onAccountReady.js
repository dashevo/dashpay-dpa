/**
 * This walkthrough implies knowledge of the BUser class
 * as a Registered BUser is required to register a profile
 */
const onAccountReady = async (account) => {
  console.log('DashPay DPA - Started');
  const dpd = account.getDPA('dashpaydpa');
  const username = 'dashpaydpa_example_profile_walkthrough';
  const buser = await dpd.buser.create(username);
  await buser.synchronize();
  buser.own(dpd.getBUserSigningPrivateKey());


  /**
   * We will here want to register a new profile,
   * so let's start with first creating our a profile object
   */
  const profileOpts = {
    about: 'I am a simple walkthrough user',
    avatarUrl: 'http://api.adorable.io/avatars/285/profile@dashevo.png',
  };
  const profile = dpd.profile.create(profileOpts);
  // console.log('==== Create a new Profile :');
  // console.log({ avatar: profile.avatar, about: profile.about, displayName: profile.displayName });

  /**
   * We then need to assign our buser to it, as we will need to access the key
   */
  profile.setOwner(buser);

  /**
   * And we can now register our profile
   */
  // const profileregid = await profile.register();
  // const profileregid = '1742dda9d60002b9b91083d0c68128d0eefae34937e2af0d9d8116a869de4f24';

  /**
   * We can then perform a search from that profile id
   */

  // const getProfileByProfileId = await dpd.profile.getById(profileregid);
  // console.log('==== GET PROFILE FROM PID');
  // console.log(getProfileByProfileId);

  /**
   * We can then perform a search from a BUsername
   */

  const getProfileByBUsername = await dpd.profile.getByBUsername(buser.username);
  console.log('==== GET PROFILE FROM BUsername');
  console.log(getProfileByBUsername);
  /**
   * We can then perform a search from a DisplayName
    * TODO : FIXME
   */

  // const getProfileByDisplayname = await dpd.profile.getByDisplayName(profileOpts.displayName);
  // console.log('==== GET PROFILE FROM DisplayName');
  // console.log(getProfileByDisplayname);

  const getProfileByUID = await dpd.profile.getByUserId(buser.regtxid);
  console.log('==== GET PROFILE FROM UID');
  console.log(getProfileByUID);


  /**
   * Or perform a search of all of them
   */

  const profiles = await dpd.profile.getAll();
  console.log('==== GET ALL PROFILES');
  console.log(profiles);
};
module.exports = onAccountReady;
