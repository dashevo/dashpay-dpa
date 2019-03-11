
const verifyBUserRequisites = async (dpp) => {
  const { username } = dpp;
  console.log('Verifying BUser requisites');
  // We check again buser ourself, in case one would have registered recently.
  let buser;
  try {
    buser = await dpp.getBUserByUname(username);
    // Here we have an existing answer, let's try to use the keys
    // For now we consider it ours.
    this.buser = buser;
  } catch (e) {
    if (e.message.split('Code:')[1] !== '-1"') {
      console.error('Expected "not found answer" got ', e.message, 'instead');
      console.error(e);
    }

    // At this point, user is not found, we can proceed registration
    const funding = 200000;

    console.log('Registering BUser with...', funding, 'credits');
    try {
      const reg = await dpp.registerBUser(username, funding);
    } catch (e) {
      if (e.message === 'DAPI RPC error: sendRawTransaction: Error: DAPI RPC error: sendRawTransaction: 16: bad-subtx-dupusername') {
        console.log('Found already existing duplicate');
        dpp.buser = await dpp.getBUserByUname(username);
      }
    }
  }

  console.log('BUser found', buser);
};
module.exports = verifyBUserRequisites;
