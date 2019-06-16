// const { plugins } = require('@dashevo/wallet-lib');
const { plugins } = require('../../dash-wallet-lib');
const DashPlatformProtocol = require('@dashevo/dpp');
const DashPaySchema = require('./schema/dashpay.schema.json');
const BUserFacade = require('./BUserFacade/BUserFacade');
const ContactRequestFacade = require('./ContactRequestFacade/ContactRequestFacade');
const ContactFacade = require('./ContactFacade/ContactFacade');
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
  this.buser = new BUserFacade(transporter, this);
  this.contact = new ContactFacade(transporter, this);
  this.contactRequest = new ContactRequestFacade(transporter, this);
  this.profile = new ProfileFacade(transporter, this);
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
  constructor() {
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
      verifyOnInjected: false
    });

    this.dpp = new DashPlatformProtocol();
    this.offlineMode = false;

    setDapSchema.call(this);
    setDapContract.call(this);
  }

  getBUserSigningPrivateKey() {
    // FIXME : This should ideally be a method in keychain itself :
    // this.keyChain.getFeatureHardenedPath();
    const cointype = 1;
    const hardenedFeatureKey = this.keyChain.HDPrivateKey
      .deriveChild('m', true)
      .deriveChild(44, true)
      .deriveChild(cointype);

    // Full path on testnet will be : m/44'/1'/5/0/0

    return hardenedFeatureKey
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
    setFacades.call(this, this.transport.transport);
  }
}

DashPayDAP.prototype.broadcastTransition = require('./broadcastTransition');
DashPayDAP.prototype.prepareStateTransition = require('./prepareStateTransition');

module.exports = DashPayDAP;
