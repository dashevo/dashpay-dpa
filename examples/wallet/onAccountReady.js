// const verifyBUserRequisites = require('./verifyBUserRequisites');
// const verifySchemaRequisites = require('./verifySchemaRequisites');
// const verifyProfileRequisites = require('./verifyProfileRequisites');


const onAccountReady = async (account) => {
  console.log('DashPay DAP - Started');
  /**
   * We have included dashpaydap as a plugin, let's fetch it now
   */
  const dpd = account.getDAP('dashpaydap');

  /**
   * DashPayDAP is a plugin for Wallet-Lib that allows management of own Blockchain User
   * and access to all the feature provided by the DashPayDAP
   */

  /**
   * Like getting an external BU that you can manage at a certains level (as you are not the owner)
   */
  const danceBUser = await dpd.buser.get('danceuser');
  console.log('Fetched BUSer danceuser', danceBUser);

  throw new Error();

  /**
   * In this example, we will simulate a user that which to register a new Blockchain username
   */
  const notRandomButGoodEnoughtForUsername = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5);

  const expectedBlockchainUsername = `dashpaydap_example_${notRandomButGoodEnoughtForUsername}`;

  /**
   * Let's first create a BUser with that username as argument
   */
  const expectedBUser = dpd.buser.create(expectedBlockchainUsername);
  console.log('Create BUser', expectedBUser);

  /**
   * On this one, we want to be the owner of that BUser.
   * To do that we need a private key, dpw has access to Wallet-lib and as such allow us to fetch it
   */
  const privateKey = dpd.getBUserSigningPrivateKey();
  console.log('Using privateKey', privateKey);

  /**
   * Let's call our `own` method with privateKey as argument.
   * It will tell the object which privateKey use for signing later on
   */
  expectedBUser.own(privateKey);
  /**
   * We can see that state is 'unknown', it has never been synced. Let's try to sync it
   */
  await expectedBUser.synchronize();
  console.log('Synchronized BUser', expectedBUser);
  console.log('Is BUser free to register ? ', expectedBUser.canRegister());
  /**
   * Good, it's free, let's register it then
   */
  await expectedBUser;
  // const

  /**
   * Is there an existing user with it ?
   */
  // console.log(await dpd.BUser.get('danceuser'));


  // const { username } = dpp;
  // if (username === null) {
  //   throw new Error('Impossible to retrieve nor register without a username (see DashPayDap doc)');
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
  // const profiles = (await dpp.transport.transport.fetchDocuments(dpp.dpp.getContract().getId(), 'profile', {})).reduce((prev, curr) => { prev.push(curr.bUserName); return prev; }, []);

  // console.log('Profiles : ', profiles);

  // console.log(await dpp.transport.transport.fetchDocuments(
  //  dpp.dpp.getContract().getId(), 'contact', {}),
  // );
  /**
   * Ensure we do have a profile on Dashpay DAP
   * If we do not have a profile existing, then we create a new with passed arguments
   */
  // await verifyProfileRequisites(dpp,
  //   {
  //     avatar: 'https://pbs.twimg.com/profile_images/736134012369043456/lCbfoCFb_400x400.jpg',
  //     bio: 'still testing',
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
