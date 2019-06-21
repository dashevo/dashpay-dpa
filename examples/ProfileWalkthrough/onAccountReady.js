/**
 * This walkthrough implies knowledge of the BUser class
 * as a Registered BUser is required to register a profile
 */
const onAccountReady = async (account) => {
  console.log('DashPay DAP - Started');
  const dpd = account.getDAP('dashpaydap');
  const username = 'dashpaydap_example_profile_walkthrough';
  const buser = await dpd.buser.create(username);
  await buser.synchronize();
  buser.own(dpd.getBUserSigningPrivateKey());


  /**
   * We will here want to register a new profile,
   * so let's start with first creating our a profile object
   */
  const profileOpts = {
    avatar: 'https://api.adorable.io/avatars/285/profile@dashevo.png',
    bio: 'I am a simple walkthrough user',
    displayName: 'walkthough user',
  };
  const profile = dpd.profile.create(profileOpts);
  // console.log('==== Create a new Profile :');
  // console.log({ avatar: profile.avatar, bio: profile.bio, displayName: profile.displayName });

  /**
   * We then need to assign our buser to it, as we will need to access the key
   */
  profile.setOwner(buser);

  /**
   * And we can now register our profile
   */
  const profileregid = await profile.register();
  // const profileregid = '3b0b17bc0a0ddba02101687edc7f27cd0e605af4492e10e55e106c0879fc4390..';
  // const profileregid = '1742dda9d60002b9b91083d0c68128d0eefae34937e2af0d9d8116a869de4f24...';
  // const profileregid = '1742dda9d60002b9b91083d0c68128d0eefae34937e2af0d9d8116a869de4f24';
  console.log(profileregid);


  /**
   * We can then perform a search from that profile id
   */

  const getProfileByProfileId = await dpd.profile.getById(profileregid);
  console.log('==== GET PROFILE FROM PID');
  console.log(getProfileByProfileId);

  /**
   * We can then perform a search from a BUsername
   */

  const getProfileByBUsernamme = await dpd.profile.getByBUsername(buser.username);
  console.log('==== GET PROFILE FROM BUsername');
  console.log(getProfileByBUsernamme);
  /**
   * We can then perform a search from a DisplayName
   */

  const getProfileByDisplayname = await dpd.profile.getByDisplayName(profileOpts.displayName);
  console.log('==== GET PROFILE FROM DisplayName');
  console.log(getProfileByDisplayname);

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
