/**
 * This walkthrough implies knowledge of the BUser class
 * as a Registered BUser is required to register a profile
 */
const onAccountReady = async (account) => {
  console.log('DashPay DAP - Started');
  const dpd = account.getDAP('dashpaydap');

  /**
   * We already own a buser, and already have our profile (see concerning walkthrough for more)
   * We fetch our profile back.
   */
  const username = 'dashpaydap_example_contact_walkthrough';
  const buser = await dpd.buser.get(username);
  buser.own(dpd.getBUserSigningPrivateKey());
  //
  const buserProfiles = await dpd.profile.getByBUser(buser);
  // profiletxid: caa565ebeb4f6b0168ed2633746473d8ea5190af309b1e59c5df157a99a39ae8.
  const profile = buserProfiles[0];
  profile.setOwner(buser);

  /**
   * We look-up for another profile.
   */
  const username2 = 'dashpaydap_example_contact_walkthrough2';
  const buser2 = await dpd.buser.get(username2);
  buser2.own(dpd.getBUserSigningPrivateKey());
  const buser2Profiles = await dpd.profile.getByBUser(buser2);
  const receiverProfile = buser2Profiles[0];
  receiverProfile.setOwner(buser2);

  /**
   * Let's see our contacts
   */
  const contacts = await profile.contact.getAll();
  console.log(contacts);

  console.log(await receiverProfile.contact.getAll());

  // const contactRequest = profile.contactRequest.create({ receiver: receiverProfile });
  // console.log(await contactRequest.send());
  // cac99a9c0f010e150ab39d4d34ac833f35928d213ec036326cee8e6b08a2f21f
  // const contactRequestSent = await profile.contactRequest.getAllPending();
  // console.log(contactRequestSent)

  // console.log(buser);
  // console.log(profile.contact);

  // console.log(profile.contact.getAll());
  // const contacts = await profile.contact.getAllPending();
  //
  // const request = await profile.contact.createRequest();
  // const request.register();
  // console.log(contacts);
};
module.exports = onAccountReady;


/*

Document {
  id: null,
  type: 'contact',
  scopeId: 'yjcSBCZ3eLn35vsHFYeBqsaxftC4D2J1VA',
  scope:
   'f98e30ec7dbc2145c7189b71085b166cdba5381a4d838514559a4b452dca701d',
  action: 0,
  revision: 1,
  metadata:
   DocumentMetadata {
     userId:
      '8d491c75c36d4545a357dfbe5f1d98c027dcf1e1df3af53e48c0204c620ef2e2' },
  data:
   { toUserId:
      '98f9eb003bc47e6d4fc45cba5b8d3e4911494e26ecf5d1869d224818405e7a12',
     publicKey:
      '6d1e1d66cee9ebd95aaebfc89991cfd932e7c6cbaf7f8f5a2b66c9fd3cc918b6' } }


 */
