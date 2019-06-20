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
  };
  const profile = dpd.profile.create(profileOpts);
  console.log('==== Create a new Profile :');
  console.log({ avatar: profile.avatar, bio: profile.bio });

  /**
   * We then need to assign our buser to it, as we will need to access the key
   */
  profile.setOwner(buser);

  /**
   * And we can now register our profile
   */
  const profileregid = await profile.register();

  console.log(profileregid);
};
module.exports = onAccountReady;
