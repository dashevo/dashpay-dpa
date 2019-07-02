const DashPlatformProtocol = require('@dashevo/dpp');
const { plugins } = require('@dashevo/wallet-lib');
const DashPaySchema = require('./schema/dashpay.schema.json');
const BUserFacade = require('./BUserFacade/BUserFacade');
// const ContactFacade = require('./ContactFacade/ContactFacade');
// const ContactRequestFacade = require('./ContactRequestFacade/ContactRequestFacade');
const ProfileFacade = require('./ProfileFacade/ProfileFacade');
const { createNewDPP } = require('./utils');

function getValidContract(dpp, dapName, dapSchema) {
  const contract = dpp.contract.create(dapName, dapSchema);

  if (!dpp.contract.validate(contract)
    .isValid()) {
    throw new Error('Invalid DashPayDPA contract');
  }
  return contract;
}

function setFacades(transporter) {
  const {
    broadcastTransition,
    broadcastTransaction,
    getUnusedAddress,
    prepareStateTransition,
    sendRawTransition,
    getPrivateKeys,
    getBalance,
    getUTXOS,
    dpp,
  } = this;

  const buserSigningPrivateKey = this.getBUserSigningPrivateKey();

  this.buser = new BUserFacade(transporter, {
    broadcastTransition,
    broadcastTransaction,
    getUnusedAddress,
    getBalance,
    getUTXOS,
    prepareStateTransition,
    getBUserSigningPrivateKey: () => buserSigningPrivateKey,
    getPrivateKeys,
  });
  const buserFacade = this.buser;
  this.profile = new ProfileFacade(transporter, dpp, buserFacade, {
    broadcastTransition,
    prepareStateTransition,
    sendRawTransition,
  });
}

class DashPayDAP extends plugins.DAP {
  constructor(opts = {}) {
    super({
      name: 'DashPayDAP',
      dependencies: [
        'getUTXOS',
        'getBalance',
        'getUnusedAddress',
        'sign',
        'broadcastTransaction',
        'keyChain',
        'getPrivateKeys',
        'transport',
        'offlineMode',
      ],
      schema: DashPaySchema,
      verifyOnInjected: (opts.verifyOnInjected) ? opts.verifyOnInjected : false,
    });

    this.dpp = createNewDPP();
    this.offlineMode = false;
    this.hardenedFeaturePath = null;
  }

  getBUserSigningPrivateKey(index = 0) {
    return this.hardenedFeaturePath
      .deriveChild(5)
      .deriveChild(0)
      .deriveChild(index)
      .privateKey
      .toString();
  }

  async onInjected() {
    // Method started after wallet-lib injection
    // It's here that we can access to dependencies.

    // We will need to set our current transporter to the facade
    // Private calling due to avoid any access to setFacades later on.
    if (this.offlineMode) {
      console.info('DashpayDap : Offline mode active, no transporter available');
      this.offlineMode = true;
    }
    const hardenedFeaturePath = this.keyChain.getHardenedFeaturePath();
    this.hardenedFeaturePath = hardenedFeaturePath;
    setFacades.call(this, this.transport.transport);
  }
}

DashPayDAP.prototype.broadcastTransition = require('./broadcastTransition');
DashPayDAP.prototype.prepareStateTransition = require('./prepareStateTransition');

module.exports = DashPayDAP;
