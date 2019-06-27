module.exports = async function register() {
  if (!this.buser) throw new Error('Require to first attach a buser to profile');
  const { buser } = this;
  if (buser.state !== 'open') throw new Error('Expected state to be open. Are you sync ?');
  if (!buser.isOwned) throw new Error('Expected BUser to be owned. Did you try `own(privKey`) ?');
  if (!buser.dpp) {
    throw new Error('Missing dpp - Did you attach to a buser ?');
  }
  // We prepare our object
  const profile = buser.dpp.document.create('profile', {
    avatarUrl: this.avatarUrl,
    about: this.about,
    displayName: this.displayName,
  });

  console.log('DA PROFILE:');
  profile.removeMetadata();
  // delete profile.metadata;

  console.log('Validating profile contract', buser.dpp.document.validate(profile)
    .isValid());
  const {
    serializedTransaction,
    serializedPacket,
  } = this.prepareStateTransition(
    profile,
    buser,
    buser.getBUserSigningPrivateKey(),
  );


  const txid = await this.broadcastTransition(
    serializedTransaction, serializedPacket,
  );
  // const txid = 0;

  console.log(`Profile ${buser.username}  Registered (txid ${txid}.`);
  return txid;
};
