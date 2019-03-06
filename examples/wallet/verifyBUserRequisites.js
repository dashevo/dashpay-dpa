
const verifyBUserRequisites = async (dpp, username) => {
  console.log('Verifying BUser requisites');

  const isFound = dpp.buser !== null;
  console.log('BUser found using pubkey ? :', isFound);

  if (!isFound) {
    console.log('Registering BUser...');
    const funding = 10000;
    try {
      const reg = await dpp.registerBUser(username, funding);
    } catch (e) {
      if (e.message === 'DAPI RPC error: sendRawTransaction: Error: DAPI RPC error: sendRawTransaction: 16: bad-subtx-dupusername') {
        console.log('Found already existing duplicate');
        dpp.buser = await dpp.getBUserByUname(username);
      }
    }
  }
  console.log('BUser found', dpp.buser);
};
module.exports = verifyBUserRequisites;
