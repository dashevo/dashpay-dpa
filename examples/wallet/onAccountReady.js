const verifyBUserRequisites = require('./verifyBUserRequisites');
const verifySchemaRequisites = require('./verifySchemaRequisites');

const onAccountReady = async (account) => {
  const dpp = account.getDAP('dashpaydap');
  // console.log(dpp)
  console.log('DashPay DAP - Started');

  // First, we ensure a BUser, by creating one if needed
  const username = 'demo1';
  await verifyBUserRequisites(dpp, username);

  // Let's check if we have a schema registered
  await verifySchemaRequisites(dpp);

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
