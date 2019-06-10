const { plugins } = require('@dashevo/wallet-lib');
const DashPlatformProtocol = require('@dashevo/dpp');
const DashPaySchema = require('./schema/dashpay.schema.json');

const BUser = require('./BUser/BUser');

const broadcastTransition = require('./broadcastTransition');

const isSchemaRegistered = require('./schema/isSchemaRegistered');
const registerSchema = require('./schema/registerSchema');

const isProfileRegistered = require('./profile/isProfileRegistered');
const registerProfile = require('./profile/registerProfile.js');
const searchProfile = require('./profile/searchProfile.js');


const sendContactRequest = require('./contact/sendContactRequest');
const getPendingContactRequests = require('./contact/getPendingContactRequests');
const getDeniedContactRequests = require('./contact/getDeniedContactRequests');
const getDeletedContactRequests = require('./contact/getDeletedContactRequests');
const acceptContactRequest = require('./contact/acceptContactRequest');
const deleteContactRequest = require('./contact/deleteContactRequest');
const denyContactRequest = require('./contact/denyContactRequest');
const getContacts = require('./contact/getContacts');

const registerBUser = require('./user/registerBUser.js');
const getBUserPreviousStId = require('./user/getBUserPreviousStId.js');
const getBUserByUname = require('./user/getBUserByUname.js');
const getBUserByUID = require('./user/getBUserByUID.js');
const searchBUsers = require('./user/searchBUsers.js');
const getBUserRegistrationId = require('./user/getBUserRegistrationId.js');
const topUpBUser = require('./user/topUpBUser.js');

const prepareStateTransition = require('./prepareStateTransition');

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
      ],
    });
    Object.assign(DashPayDAP.prototype, {
      broadcastTransition,
      registerProfile,
      registerBUser,
      registerSchema,
      isSchemaRegistered,
      isProfileRegistered,
      getBUserByUID,
      searchBUsers,
      acceptContactRequest,
      denyContactRequest,
      getDeniedContactRequests,
      getDeletedContactRequests,
      getBUserRegistrationId,
      deleteContactRequest,
      getBUserPreviousStId,
      searchProfile,
      getBUserByUname,
      sendContactRequest,
      prepareStateTransition,
      getPendingContactRequests,
      topUpBUser,
      getContacts,
    });

    this.dpp = new DashPlatformProtocol();
    this.dapSchema = Object.assign({}, DashPaySchema);

    const contractName = 'dashpaydap';
    this.dapContract = this.dpp.contract.create(contractName, this.dapSchema);
    if (!this.dpp.contract.validate(this.dapContract)
      .isValid()) {
      throw new Error('Invalid DashPayDPA contract');
    }
    this.dpp.setContract(this.dapContract);
  }


  async onInjected() {
    // Method started after wallet-lib injection
    // It's here that we can access to dependencies.
    const registered = await this.isSchemaRegistered();
    console.log('Schema registered', registered);
  }

  createBUserObject(username, _privateKey) {
    const coinType = (this.network === 'testnet') ? 1 : 5;
    const privateKey = (_privateKey) || this.keyChain.getKeyForPath(`m/44'/${coinType}`);
    return new BUser(username, privateKey);
  }
}

module.exports = DashPayDAP;
