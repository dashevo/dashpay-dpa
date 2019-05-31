
const verifySchemaRequisites = async (dpp) => {
  console.log('Verifying schema requisites');

  const isRegistered = await dpp.isSchemaRegistered();
  if (!isRegistered) {
    console.log('Schema not registered. Registering..');
    const regTxPrivKey = dpp.getBUserPrivateKey().toString('hex');

    const regTxId = await dpp.buser.regtxid;
    const prevStId = await dpp.getBUserPreviousStId(dpp.buser.regtxid);
    console.log('Using', regTxId, regTxPrivKey);
    console.log('User last stId', prevStId);
    const register = await dpp.registerSchema(regTxId, regTxPrivKey, prevStId);
    console.log(register);
  } else {
    console.log('Already registered');
  }
};
module.exports = verifySchemaRequisites;
