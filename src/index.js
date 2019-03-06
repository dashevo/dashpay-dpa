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

const registerProfile = require('./profile/registerProfile.js');

const registerBUser = require('./user/registerBUser.js');
const getBUserPreviousStId = require('./user/getBUserPreviousStId.js');
const getBUserPrivateKey = require('./user/getBUserPrivateKey.js');
const getBUserByPubkey = require('./user/getBUserByPubkey.js');
const getBUserByUname = require('./user/getBUserByUname.js');
const getBUser = require('./user/getBUser.js');
const getBUsernameRegistrationId = require('./user/getBUsernameRegistrationId.js');
const getBUserRegistrationId = require('./user/getBUserRegistrationId.js');


class DashPayDAP extends plugins.DAP {
  constructor() {
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
      getBUser,
      getBUsernameRegistrationId,
      getBUserRegistrationId,
      getBUserPrivateKey,
      getBUserPreviousStId,
      getBUserByPubkey,
      getBUserByUname,
    });


    this.buser = null;
    this.dapSchema = dashPaySchema;
    this.dapContract = Schema.create.dapcontract(this.dapSchema);

    // this.dapId = doubleSha256(Schema.serialize.encode(this.dapContract)).toString('hex');
    this.dapId = "1d45767901b04713c4b791cb53ae8259ed31d4377f9350fabc56110ecf12046b"
  }

  async onInjected() {
    const regTxPubKey = this.getBUserPrivateKey().publicKey.toAddress().toString();
    const users = this.getBUserByPubkey(regTxPubKey);
    if (users.length > 0) {
      console.log('Previous user found');
      this.buser = users[0];
    }
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

  async searchUsername(pattern) {
    return this.transport.transport.searchUsers(pattern);
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
