const verifyBUserRequisites = require('./verifyBUserRequisites');
const verifySchemaRequisites = require('./verifySchemaRequisites');
const verifyProfileRequisites = require('./verifyProfileRequisites');

const onAccountReady = async (account) => {
  /**
   * We have included dashpaydap as a plugin, let's fetch it now
   * It will have
   */
  const dpp = account.getDAP('dashpaydap');

  // console.log(dpp)
  console.log('DashPay DAP - Started');

  // console.log(await dpp.getBUser());

  // First, we ensure a BUser, by creating one if needed
  const username = 'seatIndoor';
  await verifyBUserRequisites(dpp, username);

  // Let's check if we have a schema registered
  // await verifySchemaRequisites(dpp);

  /**
   * Ensure we do have a profile on Dashpay DAP
   * If we do not have a profile existing, then we create a new with passed arguments
   */
  // await verifyProfileRequisites(dpp,
  //   {
  //     avatar: 'https://pbs.twimg.com/profile_images/736134012369043456/lCbfoCFb_400x400.jpg',
  //     bio: 'still testing',
  //     displayName: 'Alex Werner',
  //     props: '{}',
  //   });


  /**
   * Searching a user
   * (Waiting dashcpp side)
   */
  // const pattern = 'demo1';
  // const usersSearched = await dpp.searchBUsers(pattern);
  // console.log(`Lookup for users ${pattern} : ${JSON.stringify(usersSearched)}`);
  //

  /**
   *    Toping Up a User
   *   (Not ready dapi-client side)
   */
  // await dpp.topUpBUser();


  // const BUserRegistrationPrivateKey = await dpp.getBUserPrivateKey();
  // console.log('BUser RegPrivKey', BUserRegistrationPrivateKey.toString());
  //
  // const BUserPublicKey = BUserRegistrationPrivateKey.publicKey;
  // const BUserPublicAddress = BUserPublicKey.toAddress('testnet');
  // console.log(`BUser PubKey (${BUserPublicAddress.toString()} / ${BUserPublicKey.toString()})`);
  //
  // const registerSchemaPrivateKey = await dpp.getSchemaRegistrationPrivateKey()
  // const BUserRegistrationPrivateKey = await dpp.getBUserRegistrationPrivateKey()
  // const BUPrevStId = await dpp.getBUserPreviousSTID("boxmachine")
  // const BURegID = await dpp.getBUserRegistrationId("boxmachine")
  //
  // // console.log(await dpp.registerSchema(BURegID, BUserRegistrationPrivateKey, BUPrevStId))
  //
  // // console.log(await dpp.registerProfile('https://pbs.twimg.com/profile_images/736134012369043456/lCbfoCFb_400x400.jpg', 'still testing', "Alex Werner", 'props'));
  // console.log(await dpp.getBUser());
  // console.log(await dpp.fetchProfile());
  //
  // const hash = await account.transport.transport.getBlockHash(19227)
  //
  // console.log(await account.transport.transport.getRawBlock(hash))
  // // const dapId = await dpp.getDapContract();
  // // console.log(dapId);
  // // const registerID = await dpp.registerSchema(BURegID, BUserRegistrationPrivateKey, BUPrevStId)
  // // console.log(await dpp.registerSchema(BURegID, BUserRegistrationPrivateKey, BUPrevStId))
  //
  // // console.log(registerSchemaPrivateKey);
  //
  // //DAP DashPay (ID:aad517f1c5905373f940da5dcc36203180289419d7e78f762188645edf350b02) Registered (txid ae8a8b19018509be4328e47a9b73addf91e4459c12113cb1b898fe9264106608.
  // // console.log(await dpp.registerSchema(BURegID, BUserRegistrationPrivateKey, BUPrevStId))
  //
  // // const regUser = await dpp.registerUsername()
};
module.exports = onAccountReady;
