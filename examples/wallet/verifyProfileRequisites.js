
const verifyProfileRequisites = async (dpp, props) => {
  console.log('Verifying profile requisites');

  let isRegistered = await dpp.isProfileRegistered(props);
  if (!isRegistered) {
    console.log('Profile not registered. Registering..');
    const register = await dpp
      .registerProfile(props.avatar, props.bio, props.displayName, props.bUserName);
    console.log('Register', register);
    // if (register) {
    //   isRegistered = true;
    // }
    // const regTxPrivKey = dpp.getBUserPrivateKey().toString('hex');
    // const regTxPubAddr = dpp.getBUserPrivateKey().publicKey.toAddress()

    // const regTxId = await dpp.buser.regtxid;
    // const prevStId = await dpp.getBUserPreviousStId(dpp.buser.regtxid);
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
module.exports = verifyProfileRequisites;
