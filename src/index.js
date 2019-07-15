const { plugins } = require('@dashevo/wallet-lib');
const DashPaySchema = require('./schema/dashpay.schema.json');
const BUserFacade = require('./BUserFacade/BUserFacade');
const ProfileFacade = require('./ProfileFacade/ProfileFacade');
const { createNewDPP } = require('./utils');

function setFacades(transporter) {
  const {
    broadcastTransition,
    broadcastTransaction,
    getUnusedAddress,
    prepareStateTransition,
    sendRawTransition,
    getPrivateKeys,
    getConfirmedBalance,
    getUnonfirmedBalance,
    getTotalBalance,
    getUTXOS,
    dpp,
  } = this;

  const buserSigningPrivateKey = this.getBUserSigningPrivateKey();

  this.buser = new BUserFacade(transporter, {
    broadcastTransition,
    broadcastTransaction,
    getUnusedAddress,
    getConfirmedBalance,
    getUnonfirmedBalance,
    getTotalBalance,
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

class DashPayDPA extends plugins.DPA {
  constructor(opts = {}) {
    super({
      name: 'DashPayDPA',
      dependencies: [
        'getUTXOS',
        'getConfirmedBalance',
        'getTotalBalance',
        'getUnconfirmedBalance',
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
      console.info('DashpayDPA : Offline mode active, no transporter available');
      this.offlineMode = true;
    }
    const hardenedFeaturePath = this.keyChain.getHardenedFeaturePath();
    this.hardenedFeaturePath = hardenedFeaturePath;
    setFacades.call(this, this.transport.transport);
  }
}

DashPayDPA.prototype.broadcastTransition = require('./broadcastTransition');
DashPayDPA.prototype.prepareStateTransition = require('./prepareStateTransition');

module.exports = DashPayDPA;
