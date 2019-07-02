/**
 * This walkthrough implies knowledge of the BUser class
 * as a Registered BUser is required to register a profile
 */
const onAccountReady = async (account) => {
  console.log('DashPay DAP - Started');
  const dpd = account.getDAP('dashpaydap');

  /**
   * We already own a buser, let's fetch it
   *
   */
  const username = 'dashpaydap_example_contact_walkthrough_v2';
  const buser = await dpd.buser.get(username);
  buser.own(dpd.getBUserSigningPrivateKey(0));

  /**
   * But we also already have our profile (see concerning walkthrough for more).
   * We fetch our profile back., with our buser
   */

  const buserProfilesByBuser = await dpd.profile.getByBUser(buser);

  /**
   * Alternatively, the same result can be achieved with our userId (regtxid)
   *
   */
  const buserProfilesByUserId = await dpd.profile.getByUserId(buser.regtxid);

  /**
   * We will now look-up another profile from someone else
   */
  const username2 = 'dashpaydap_example_contact_walkthrough2_v2';
  const buser2 = await dpd.buser.get(username2);
  buser2.own(dpd.getBUserSigningPrivateKey(1));
  const buser2ProfilesByBuser = await dpd.profile.getByBUser(buser2);
  /**
   * We will send a contact request to this profile
   */
    // Because many profile can exist by a user.
  const senderProfile = buserProfilesByBuser[0];
  const receiverProfile = buser2ProfilesByBuser[0];

  // We assign owner to these profile
  // FIXME : May be better way to do it :D
  senderProfile.setOwner(buser);
  receiverProfile.setOwner(buser2);

  /**
   * We then create our request by just passing it the receiver, and send it
   */

  // const request = await senderProfile.contactRequest.create({ receiver: receiverProfile });
  // const sent = await request.send();
  // console.log(sent);


  /**
   * Which will then be displayed as pending.sent
   */

  // const senderContacts = await senderProfile.contact.getAll();
  // console.log('==Our pendings');
  // console.log(senderContacts.pending);

  /**
   * Or received by the other
   */
  // const receiverContacts = await receiverProfile.contact.getAll();
  // console.log('==His pendings');
  // console.log(receiverContacts.pending);


  /**
   * We also do another request to another guy, this one having him to accept
   */
  const username3 = 'dashpaydap_example_contact_walkthrough3_v2';
  const buser3 = await dpd.buser.get(username3);
  buser3.own(dpd.getBUserSigningPrivateKey(2));
  const buser3ProfilesByBuser = await dpd.profile.getByBUser(buser3);
  const thirdProfile = buser3ProfilesByBuser[0];
  thirdProfile.setOwner(buser3);

  // const request = await senderProfile.contactRequest.create({ receiver: thirdProfile });
  // const sent = await request.send();

  // console.log(await senderProfile.contact.getAll());
  console.log(await senderProfile.contact.getPendingRequest());

  // console.log(await thirdProfile.contact.getAll());
  // console.log(await thirdProfile.contact.getPendingRequest());
  // const thirdProfileContacts = await thirdProfile.contact.getAll();
  // const receivedPendingRequest = thirdProfileContacts.pending;
  // await thirdProfile.contactRequest.accept(receivedPendingRequest[0])

  /**
   * A yet another person, has sent us a request, let's accept it.
   */
  // const username4 = 'dashpaydap_example_contact_walkthrough4_v2';
  // const buser4 = await dpd.buser.get(username4);
  // buser4.own(dpd.getBUserSigningPrivateKey(4));
  // const buser4ProfilesByBuser = await dpd.profile.getByBUser(buser4);
  // const fourthProfile = buser4ProfilesByBuser[0];
  // fourthProfile.setOwner(buser4);
  //
  // const request = await fourthProfile.contactRequest.create({ receiver: senderProfile });
  // const sent = await request.send();

  /**
   * But we do not necessarely wish to accept them, so sometimes they will be received Pending
   * that you can deny
   */
  //
  // const username4 = 'dashpaydap_example_contact_walkthrough4_v2';
  // const buser4 = await dpd.buser.get(username4);
  // buser4.own(dpd.getBUserSigningPrivateKey(4));
  // const buser4ProfilesByBuser = await dpd.profile.getByBUser(buser4);
  // const fourthProfile = buser4ProfilesByBuser[0];
  // console.log(fourthProfile)


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
