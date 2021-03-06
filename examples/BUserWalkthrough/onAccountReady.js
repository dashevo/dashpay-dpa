const onAccountReady = async (account) => {
  console.log('DashPay DPA - Started');
  /**
   * We have included dashpaydpa as a plugin, let's fetch it now
   */
  const dpd = account.getDPA('dashpaydpa');

  /**
   * DashPayDPA is a plugin for Wallet-Lib that allows management of own Blockchain User
   * and access to all the feature provided by the DashPayDPA
   */

  /**
   * Like getting an external BU that you can manage at a certains level (as you are not the owner)
   */
  const danceBUser = await dpd.buser.get('danceuser');
  console.log('==== Fetching BUser : danceuser');
  console.log(danceBUser);
  console.log('\n');
  /**
   * In this example, we will simulate a user that which to register a new Blockchain username
   */
  const notRandomButGoodEnoughtForUsername = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5);

  const expectedBlockchainUsername = `dashpaydpa_example_${notRandomButGoodEnoughtForUsername}`;

  /**
   * Let's first create a BUser with that username as argument
   */
  const expectedBUser = dpd.buser.create(expectedBlockchainUsername);
  console.log('==== Creating a new BUser. Uname:', expectedBlockchainUsername);
  console.log(expectedBUser);

  /**
   * On this one, we will want to first assign our PrivateKey to it.
   * This is done by 'owning' that BUser object.
   * To do that, we will get our PrivateKey from the instance of dashpaydpa above
   */
  const privateKey = dpd.getBUserSigningPrivateKey();
  console.log('Will use privateKey:', privateKey);

  /**
   * Let's call our `own` method with privateKey as argument.
   * It will tell the object which privateKey use for signing later on
   */
  expectedBUser.own(privateKey);
  /**
   * We can also see that state of our buser is 'unknown'.
   * It has never been synced. Let's try to sync it to ensure it's not registered
   */
  await expectedBUser.synchronize();
  console.log('Synchronized BUser');
  console.log(`BUser ${expectedBUser.username} state : ${expectedBUser.state}`);

  /**
   * When synchronized, the method `canRegister` can be used to quickly assert it.
   */
  const expectedBUserIsFree = expectedBUser.canRegister();
  console.log('Is BUser free to register ? ', expectedBUserIsFree);
  if (!expectedBUser) throw new Error('It was supposed to be available, relaunch the example.');
  /**
   * Good, it's free, let's register it then
   */

  // await expectedBUser;
  // const

  /**
   * Is there an existing user with it ?
   */
  // console.log(await dpd.BUser.get('danceuser'));


  // const { username } = dpp;
  // if (username === null) {
  //   throw new Error(
  //     'Impossible to retrieve nor register without a username (see DashPayDpa doc)'
  //   );
  // }

  // console.log('Retrieve/Register :', username);
  // console.log('New unused address (for funding)', account.getUnusedAddress().address);

  // First, we need to verify using our provided username
  // if we already have an existing username created.
  // If not we create it
  // If yes, we try to use our keys on it
  // if it do not work, it's not ours and it's a duplicate registration
  // When registered, we want to wait for 1 block for confirmation]

  // await verifyBUserRequisites(dpp);

  // const height = await dpp.transport.transport.getBestBlockHeight();
  // const hash = await dpp.transport.transport.getBlockHash(height);
  // const raw = await dpp.transport.transport.getRawBlock(hash)
  // console.log(raw)
  // This method ensure a schema is registered
  // await verifySchemaRequisites(dpp);

  // List all existing profile on DashPay
  // const profiles = (
  //   await dpp.transport.transport.fetchDocuments(dpp.dpp.getContract().getId(), 'profile', {})
  // ).reduce((prev, curr) => { prev.push(curr.bUserName); return prev; }, []);

  // console.log('Profiles : ', profiles);

  // console.log(await dpp.transport.transport.fetchDocuments(
  //  dpp.dpp.getContract().getId(), 'contact', {}),
  // );
  /**
   * Ensure we do have a profile on Dashpay DPA
   * If we do not have a profile existing, then we create a new with passed arguments
   */
  // await verifyProfileRequisites(dpp,
  //   {
  //     avatar: 'https://pbs.twimg.com/profile_images/736134012369043456/lCbfoCFb_400x400.jpg',
  //     about: 'still testing',
  //     displayName: 'Alex Werner7',
  //     bUserName: username,
  //   });


  /**
   * Searching a user
   * (Waiting dashcpp side)
   */
  // const pattern = 'AlexWerner2';
  // const usersSearched = await dpp.searchBUsers(pattern);
  // console.log(`Lookup for users ${pattern} : ${JSON.stringify(usersSearched)}`);
  //

  /**
   * Search a profile
   *
   */
  // const pattern = 'AlexWerner2';
  // const usersSearched = await dpp.searchProfile(pattern);
  // console.log(`Lookup for users ${pattern} : ${JSON.stringify(usersSearched)}`);


  /**
   * Get contacts
   */
  // const contacts = await dpp.getContacts();
  // console.log('Contacts', contacts);

  /**
   * Get waiting receivedcontact request
   */
  // const pendingWaitingReceived = await dpp.getPendingContactRequests();
  // console.log('Pendign contact requests', pendingWaitingReceived);


  /**
   * Get denied contact
   */
  // const deniedReceived = await dpp.getDeniedContactRequests();
  // console.log('Denied contact requests', deniedReceived);

  /**
   * Get deleted contact
   */
  // const deletedContacts = await dpp.getDeletedContactRequests();
  // console.log('Deleted contacts', deletedContacts);


  /**
   * Sending contact request
   */

  // const send = await dpp.sendContactRequest('AlexWerner7');

  /**
   * Deny contact request
   */

  // const deny = await dpp.denyContactRequest('AlexWerner3');


  /**
   * Sending accept request
   */
  // const send = await dpp.acceptContactRequest('AlexWerner3');

  /**
   * Delete a contact
   */
  // const del = await dpp.deleteContactRequest('AlexWerner3');


  /**
   *    Toping Up a User
   *   (Not ready dapi-client side)
   */
  // await dpp.topUpBUser();
};
module.exports = onAccountReady;
