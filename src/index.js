const {plugins, utils} = require('@dashevo/wallet-lib');
const DashPlatformProtocol = require('@dashevo/dpp');
const DashPaySchema = require('./schema/dashpay.schema.json');

const {doubleSha256} = utils;

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
const getBUserPrivateKey = require('./user/getBUserPrivateKey.js');
const getBUserByPubkey = require('./user/getBUserByPubkey.js');
const getBUserByUname = require('./user/getBUserByUname.js');
const getBUser = require('./user/getBUser.js');
const searchBUsers = require('./user/searchBUsers.js');
const getBUsernameRegistrationId = require('./user/getBUsernameRegistrationId.js');
const getBUserRegistrationId = require('./user/getBUserRegistrationId.js');
const topUpBUser = require('./user/topUpBUser.js');

const prepareStateTransition = require('./prepareStateTransition');

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
      ],
    });
    Object.assign(DashPayDAP.prototype, {
      broadcastTransition,
      registerProfile,
      registerBUser,
      registerSchema,
      isSchemaRegistered,
      isProfileRegistered,
      getBUser,
      searchBUsers,
      acceptContactRequest,
      denyContactRequest,
      getDeniedContactRequests,
      getDeletedContactRequests,
      getBUsernameRegistrationId,
      getBUserRegistrationId,
      getBUserPrivateKey,
      deleteContactRequest,
      getBUserPreviousStId,
      searchProfile,
      getBUserByPubkey,
      getBUserByUname,
      sendContactRequest,
      prepareStateTransition,
      getPendingContactRequests,
      topUpBUser,
      getContacts,
    });

    this.username = opts.username;
    this.buser = null;
    this.profile = null;

    this.dpp = new DashPlatformProtocol();
    this.dapSchema = Object.assign({}, DashPaySchema);

    this.dapContract = this.dpp.contract.create('DPDPA', this.dapSchema);
    if(!this.dpp.contract.validate(this.dapContract).isValid()){
      throw new Error('Invalid DashPayDPA contract');
    }
  }

  // Method started after wallet-lib injection
  // It's here that we can access to dependencies.
  async onInjected() {
    // It is currently not possible to fetch BUser by PubKey. So we do by username for now;
    if (this.username !== null) {
      try {
        this.buser = await this.getBUserByUname(this.username);
        // try{
        // this.profile =
        // }
      } catch (e) {
        if (e.message.split('Code:')[1] !== '-1"') {
          console.error('Expected "not found answer" got ', e.message, 'instead');
          console.error(e);
        }
        this.buser = null;
      }
    }
    // Pseudo-logic for when we will be able to search by pubKey

    // const regTxPubKey = this.getBUserPrivateKey().publicKey.toAddress().toString();
    // const users = this.getBUserByPubkey(regTxPubKey);
    // if (users.length > 0) {
    //   console.log('Previous user found');
    //   this.buser = users[0];
    // }
  }
}

module.exports = DashPayDAP;
