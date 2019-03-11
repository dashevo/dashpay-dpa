const { plugins, CONSTANTS, utils } = require('@dashevo/wallet-lib');
const Dashcore = require('@dashevo/dashcore-lib');
const Schema = require('@dashevo/dash-schema/dash-schema-lib');
const dashPaySchema = require('./schema/dashpay.schema.json');

const { doubleSha256 } = utils;

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

    this.dapSchema = Object.assign({}, dashPaySchema);

    this.dapContract = Schema.create.dapcontract(this.dapSchema);


    // this.dapContract.dapcontract.meta.id = 'ab6cb0c0266a02565b6bc87c5993430495e827ac0221d4fbfe7c412c7704c996';

    this.dapId = doubleSha256(Schema.serialize.encode(this.dapContract.dapcontract)).toString('hex');
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
