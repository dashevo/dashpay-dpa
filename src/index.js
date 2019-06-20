const DashPlatformProtocol = require('@dashevo/dpp');
const { plugins } = require('@dashevo/wallet-lib');
const DashPaySchema = require('./schema/dashpay.schema.json');
const BUserFacade = require('./BUserFacade/BUserFacade');
const ContactFacade = require('./ContactFacade/ContactFacade');
const ContactRequestFacade = require('./ContactRequestFacade/ContactRequestFacade');
const ProfileFacade = require('./ProfileFacade/ProfileFacade');

function getValidContract(dpp, dapName, dapSchema) {
  const contract = dpp.contract.create(dapName, dapSchema);

  if (!dpp.contract.validate(contract)
    .isValid()) {
    throw new Error('Invalid DashPayDPA contract');
  }
  return contract;
}

const setFacades = function (transporter) {
  const {
    broadcastTransition,
    broadcastTransaction,
    getUnusedAddress,
    prepareStateTransition,
    sendRawTransition,
    getPrivateKeys,
    getBalance,
    getUTXOS,
  } = this;

  const buserSigningPrivateKey = this.getBUserSigningPrivateKey();

  this.buser = new BUserFacade(transporter, {
    broadcastTransition,
    broadcastTransaction,
    getUnusedAddress,
    getBalance,
    getUTXOS,
    getBUserSigningPrivateKey: () => buserSigningPrivateKey,
    getPrivateKeys,
  });
  this.contact = new ContactFacade(transporter, { broadcastTransition });
  this.contactRequest = new ContactRequestFacade(transporter,
    {
      broadcastTransition,
      sendRawTransition,
      prepareStateTransition
    });
  this.profile = new ProfileFacade(transporter, {
    broadcastTransition,
    prepareStateTransition,
    sendRawTransition
  });
};
const setDapSchema = function () {
  this.dapSchema = Object.assign({}, DashPaySchema);
};
const setDapContract = function () {
  this.dapName = 'DashPayNativePreDemo1';
  // this.dapName = 'dashpaydap';
  this.dapContract = getValidContract(this.dpp, this.dapName, this.dapSchema);
  this.dpp.setContract(this.dapContract);
};

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

    this.dpp = new DashPlatformProtocol();
    this.offlineMode = false;
    this.hardenedFeaturePath = null;

    setDapSchema.call(this);
    setDapContract.call(this);
  }

  getBUserSigningPrivateKey() {
    return this.hardenedFeaturePath
      .deriveChild(5)
      .deriveChild(0)
      .deriveChild(0)
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
