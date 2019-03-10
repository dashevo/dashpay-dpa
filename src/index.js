const { plugins, CONSTANTS, utils } = require('@dashevo/wallet-lib');
const Dashcore = require('@dashevo/dashcore-lib');
const Schema = require('@dashevo/dash-schema/dash-schema-lib');
const dashPaySchema = require('./schema/dashpay.schema.json');

const { doubleSha256 } = utils;
const {
  acceptContactRequest,
  createContactRequest,
  removeContact,
} = require('./contactAction');

const broadcastTransition = require('./broadcastTransition');

const isSchemaRegistered = require('./schema/isSchemaRegistered');
const registerSchema = require('./schema/registerSchema');

const isProfileRegistered = require('./profile/isProfileRegistered');
const registerProfile = require('./profile/registerProfile.js');


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
      getBUsernameRegistrationId,
      getBUserRegistrationId,
      getBUserPrivateKey,
      getBUserPreviousStId,
      getBUserByPubkey,
      getBUserByUname,
      topUpBUser,
    });

    this.username = opts.username;
    this.buser = null;


    this.dapSchema = Object.assign({}, dashPaySchema);

    this.dapContract = Schema.create.dapcontract(this.dapSchema);


    this.dapContract.dapcontract.meta.id = 'ab6cb0c0266a02565b6bc87c5993430495e827ac0221d4fbfe7c412c7704c996';

    this.dapId = doubleSha256(Schema.serialize.encode(this.dapContract.dapcontract)).toString('hex');
  }

  // Method started after wallet-lib injection
  // It's here that we can access to dependencies.
  async onInjected() {
    // It is currently not possible to fetch BUser by PubKey. So we do by username for now;
    if (this.username !== null) {
      try {
        this.buser = await this.getBUserByUname(this.username);
      } catch (e) {
        if (e.message.split('Code:')[1] !== '-1"') {
          console.error('Expected "not found answer" got ', e.message, 'instead');
          console.error(e);
        }
        this.buser = null;
      }
    }
    //Pseudo-logic for when we will be able to search by pubKey

    // const regTxPubKey = this.getBUserPrivateKey().publicKey.toAddress().toString();
    // const users = this.getBUserByPubkey(regTxPubKey);
    // if (users.length > 0) {
    //   console.log('Previous user found');
    //   this.buser = users[0];
    // }
  }

  async registerSchema(regTxId, regTxPrivKey, prevStId) {
    let { stpacket: stPacket } = Schema.create.stpacket();
    stPacket = Object.assign(stPacket, this.dapContract);

    const transaction = new Dashcore.Transaction()
      .setType(Dashcore.Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION);

    const serializedPacket = Schema.serialize.encode(stPacket);
    const stPacketHash = doubleSha256(serializedPacket).toString('hex');

    console.log(`DAP ${this.dapContract.dapcontract.dapname} (ID:${this.dapId}) Registered.`);

    transaction.extraPayload
      .setRegTxId(regTxId)
      .setHashPrevSubTx(prevStId)
      .setHashSTPacket(stPacketHash)
      .setCreditFee(1000)
      .sign(regTxPrivKey);

    const txid = await this.broadcastTransition(transaction.serialize(), serializedPacket.toString('hex'));
    return txid;
  }


  async getUserRegTxIdAndPrevSubTx(userId) {
    return await require('./getUserRegTxIdAndPrevSubTx')(this.transport.transport, userId);
  }

  async getUser(username) {
    return this.transport.transport.getUserByName(username);
  }

  /**
   * @param {string} userId
   * @param {number} amount - top up amount in duffs
   * @return {Promise<string>} - tx id
   */
  async topUpUserCredits(userId, amount) {
    throw new Error('Not implemented');
  }


  payToUsername(userId, amount) {
    throw new Error('Not implemented');
  }

  sendPaymentRequests(opts) { // only to people who have added them as contacts
    throw new Error('Not implemented');
  }

  async createContactRequest(userId) {
    const { privateKey } = this.keyChain.getKeyForPath('m/2/0');
    const { userRegTxId, prevSubTx } = await this.getUserRegTxIdAndPrevSubTx(userId);

    return await createContactRequest(
      Dashcore,
      this.transport.transport,
      this.userId,
      this.dapId,
      privateKey,
      userRegTxId,
      prevSubTx,
    );
  }

  async getContactRequests() { // from people that sent requests to current account
    return await require('./getContactRequests')(
      this.transport.transport,
      this.dapId,
    );
  }

  getContactProposals() { // from current account that sent requests to people
    throw new Error('Not implemented');
  }

  async acceptContactRequest(userId) {
    const { privateKey } = this.keyChain.getKeyForPath('m/2/0');
    const { userRegTxId, prevSubTx } = await this.getUserRegTxIdAndPrevSubTx(userId);

    return await acceptContactRequest(
      Dashcore,
      this.transport.transport,
      this.userId,
      this.dapId,
      privateKey,
      userRegTxId,
      prevSubTx,
    );
  }

  denyContactRequest(opts) {
    throw new Error('Not implemented');
  }

  getIgnoredContacts() {
    throw new Error('Not implemented');
  }

  async removeContact(userId) {
    const { privateKey } = this.keyChain.getKeyForPath('m/2/0');
    const { userRegTxId, prevSubTx } = await this.getUserRegTxIdAndPrevSubTx(userId);

    return await removeContact(
      Dashcore,
      this.transport.transport,
      this.userId,
      this.dapId,
      privateKey,
      userRegTxId,
      prevSubTx,
    );
  }

  async getContacts() {
    return await require('./getContacts')(
      this.transport.transport,
      this.dapId,
      this.userId,
    );
  }

  getAccountHistory(opts) { // payments sent,payments received, contacts confirmed, contacts requests canceled etc.
    throw new Error('Not implemented');
  }
}

module.exports = DashPayDAP;
