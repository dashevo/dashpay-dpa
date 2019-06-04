/**
 *
 * @param avatar - b64 representation or url of the avatar
 * @param bio - string
 * @param displayName - string
 * @param props - string - stringified object of additional props.
 * @return {Promise<string>}
 */
module.exports = async function registerProfile(avatar = '', bio = '', displayName = '', bUserName = '') {
  if (this.buser === null) {
    try {
      this.buser = await this.getBUserByUname(this.username);
    } catch (e) {
      throw new Error('BUser not registered. Can\'t register profile');
    }
  }

  //TODO : Clean me up, I might not be at the best spot
  await this.getBUser(this.username);
  console.log(this.buser.regtxid);
  this.dpp.setUserId(this.buser.regtxid)
  // We prepare our object
  const profile = this.dpp.document.create('profile',{
    avatarUrl: avatar,
    about: bio,
  });

  console.log('Validating profile contract', this.dpp.document.validate(profile).isValid());
  const {
    serializedTransaction,
    serializedPacket,
  } = this.prepareStateTransition(profile, this.buser, this.getBUserPrivateKey().toString('hex'));

  const txid = await this.broadcastTransition(
    serializedTransaction, serializedPacket,
  );
  // const txid = 0;

  console.log(`Profile ${displayName}  Registered (txid ${txid}.`);
  return txid;
};
