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
  const username = 'dashpaydap_example_contact_walkthrough1_v4';
  const buser = await dpd.buser.get(username);
  buser.own(dpd.getBUserSigningPrivateKey(1));


  // const username2 = 'dashpaydap_example_contact_walkthrough2_v4';
  // const buser2 = await dpd.buser.get(username2);
  // buser2.own(dpd.getBUserSigningPrivateKey(2));
  // const buser2ProfilesByBuser = await dpd.profile.getByBUser(buser2);
  //
  // console.log(buser2)
  // console.log(buser2ProfilesByBuser)

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
   * Or by username
   */
  const buserProfilesByUsername = await dpd.profile.getByBUsername(buser.username);
  console.log(buserProfilesByUsername, buser.username, dpd.profile.getByUserId)


  /**
   * We will now look-up another profile from someone else
   //  */
  const username2 = 'dashpaydap_example_contact_walkthrough2_v4';
  const buser2 = await dpd.buser.get(username2);
  buser2.own(dpd.getBUserSigningPrivateKey(2));
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

  const senderContacts = await senderProfile.contact.getPendingRequest();
  console.log('==Our pendings');
  // console.log(senderContacts);

  /**
   * Or received by the other
   */
  const receiverContacts = await receiverProfile.contact.getPendingRequest();
  console.log('==His pendings');
  // console.log(receiverContacts);


  /**
   * We also do another request to another guy, this one having him to accept
   */
  const username3 = 'dashpaydap_example_contact_walkthrough3_v4';
  const buser3 = await dpd.buser.get(username3);
  buser3.own(dpd.getBUserSigningPrivateKey(3));
  const buser3ProfilesByBuser = await dpd.profile.getByBUser(buser3);
  const thirdProfile = buser3ProfilesByBuser[0];
  thirdProfile.setOwner(buser3);
  //
  // const request = await senderProfile.contactRequest.create({ receiver: thirdProfile });
  // const sent = await request.send();

  // const thirdProfileReceivedPending = (await thirdProfile.contact.getPendingRequest()).received;
  // const pendingRequest = thirdProfileReceivedPending[0];
  // console.log(await thirdProfile.contactRequest.accept(pendingRequest));

  /**
   * Both of us will be able to find our accepted contacts
   */

  // console.log(await senderProfile.contact.getAll());
  // console.log(await thirdProfile.contact.getAll());

  /**
   * As well, we will be able to see our sent contact request that were accepted
   */
  console.log(await senderProfile.contact.getAcceptedSentContactRequest())
  /**
   * A yet another person, has sent us a request, let's accept it.
   */
  const username4 = 'dashpaydap_example_contact_walkthrough4_v4';
  const buser4 = await dpd.buser.get(username4);
  buser4.own(dpd.getBUserSigningPrivateKey(4));
  const buser4ProfilesByBuser = await dpd.profile.getByBUser(buser4);
  const fourthProfile = buser4ProfilesByBuser[0];
  fourthProfile.setOwner(buser4);

  // const request = await fourthProfile.contactRequest.create({ receiver: senderProfile });
  // const sent = await request.send();

  // const sendingProfilePendingRequests = (await senderProfile.contact.getPendingRequest()).received;
  // As we want to keep first unresponded
  // const sendingProfilePendingRequest = sendingProfilePendingRequests[1];
  // console.log(await senderProfile.contactRequest.accept(sendingProfilePendingRequest));

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
