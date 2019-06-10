const DashPlatformProtocol = require('@dashevo/dpp');
const DashPaySchema = require('../schema/dashpay.schema.json');

const defaultOpts = {
  avatar: '',
  bio: '',
};

// function isStringInput(args) {
//   return args && args[0].constructor.name === String.name;
// }

function isObjectInput(args) {
  return args && args[0].constructor.name === Object.name;
}

function getValidContract(dpp, dapName, dapSchema) {
  const contract = dpp.contract.create(dapName, dapSchema);

  if (!dpp.contract.validate(contract)
    .isValid()) {
    throw new Error('Invalid DashPayDPA contract');
  }
  return contract;
}

class Profile {
  constructor(...args) {
    this.avatar = defaultOpts.avatar;
    this.bio = defaultOpts.bio;
    if (isObjectInput(args)) {
      this.fromJSON(args[0]);
    }
  }

  fromJSON(json) {
    if (json.avatar) this.avatar = json.avatar;
    if (json.bio) this.bio = json.bio;
  }

  async register() {
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
    } = this.prepareStateTransition(profile, this.buser, this.getBUserSigningPrivateKey());

    const txid = await this.broadcastTransition(
      serializedTransaction, serializedPacket,
    );
    // const txid = 0;

    console.log(`Profile ${this.buser.username}  Registered (txid ${txid}.`);
    return txid;
  }

  attachBUser(buser) {
    this.buser = buser;

    this.buser.dpp = new DashPlatformProtocol();
    const contract = getValidContract(this.buser.dpp, 'dashpaydap', Object.assign({}, DashPaySchema));
    this.buser.dpp.setContract(contract);

    this.buser.dpp.setUserId(this.buser.regtxid);
  }
}


module.exports = Profile;
