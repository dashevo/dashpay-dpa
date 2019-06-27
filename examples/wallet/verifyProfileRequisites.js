module.exports = async function verifyProfileRequisites(dpp, props) {
  console.log('Verifying profile requisites');

  let isRegistered = await dpp.isProfileRegistered(props);
  if (!isRegistered) {
    console.log('Profile not registered. Registering..');
    const register = await dpp
      .registerProfile(props.avatar, props.about);
    console.log('Register', register);
    // if (register) {
    //   isRegistered = true;
    // }
    // const regTxPrivKey = dpp.getBUserPrivateKey().toString('hex');
    // const regTxPubAddr = dpp.getBUserPrivateKey().publicKey.toAddress()

    // const regTxId = await dpp.BUser.regtxid;
    // const prevStId = await dpp.getBUserPreviousStId(dpp.BUser.regtxid);
    // console.log('Using', regTxId, regTxPrivKey);
    // console.log('User last stId', prevStId);
    // const register = await dpp.registerSchema(regTxId, regTxPrivKey, prevStId);
    // console.log(register)
  } else {
    console.log('Profile already registered');
    isRegistered = true;
  }
  return isRegistered;
};
