module.exports = async function register() {
  if (!this.buser) throw new Error('Require to first attach a buser to profile');
  if (this.buser.state !== 'open') throw new Error('Expected state to be open. Are you sync ?');
  if (!this.buser.isOwned) throw new Error('Expected BUser to be owned. Did you try `own(privKey`) ?');
  if (!this.buser.dpp) {
    throw new Error('Missing dpp - Did you attach to a buser ?');
  }
  // We prepare our object
  const profile = this.buser.dpp.document.create('profile', {
    avatarUrl: this.avatar,
    about: this.bio,
  });

  console.log('Validating profile contract', this.buser.dpp.document.validate(profile)
    .isValid());
  const {
    serializedTransaction,
    serializedPacket,
  } = this.prepareStateTransition(profile, this.buser, this.getBUserSigningPrivateKey(), this);


  const txid = await this.broadcastTransition(
    serializedTransaction, serializedPacket,
  );
  // const txid = 0;

  console.log(`Profile ${this.buser.username}  Registered (txid ${txid}.`);
  return txid;
};
