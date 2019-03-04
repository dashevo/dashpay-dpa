const { plugins, CONSTANTS, utils } = require('@dashevo/wallet-lib');
const Dashcore = require('@dashevo/dashcore-lib');
const Schema = require('@dashevo/dash-schema/dash-schema-lib');
const dashPaySchema = require('./dashpay.schema.json');
const {doubleSha256} = utils;
const {
  acceptContactRequest,
  createContactRequest,
  removeContact,
} = require('./contactAction');

class DashPayDAP extends plugins.DAP {
  constructor(){
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
    this.dapContract = Schema.create.dapcontract(dashPaySchema);
    this.dapId = doubleSha256(Schema.serialize.encode(this.dapContract.dapcontract)).toString('hex');
  }
  async ensureSchemaRegistered(regTxId, regTxPrivKey, prevStId) {
    try {
      const dapContractFromDAPI = await this.transport.transport.fetchDapContract(this.dapId);
      return dapContractFromDAPI;
    } catch (e) {
      await this.registerSchema(regTxId, regTxPrivKey, prevStId);
    }
  }


  async broadcastTransition(rawTransaction, rawTransactionPacket){
    return this.transport.transport.sendRawTransition(
      rawTransaction,
      rawTransactionPacket,
    );
  }
  async registerSchema(regTxId, regTxPrivKey, prevStId){
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
      .sign(regTxPrivKey)

    const txid = await this.broadcastTransition(transaction.serialize(), serializedPacket.toString('hex'));
    return txid;
  }
  /**
   * @param {string} blockchainUsername - string representation of the user desired username
   * @param {number} [funding] - default funding for the account in duffs. Optional.
   * If left empty funding will be 10000.
   * @return {string} - user id
   */
  async registerUsername(blockchainUsername) {
    return await require('./registerUsername')(Dashcore, this.transport.transport, blockchainUsername);
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


  payToUsername (userId, amount){
    throw new Error('Not implemented');
  }

  sendPaymentRequests (opts) { //only to people who have added them as contacts
    throw new Error('Not implemented');
  }

  async createContactRequest(userId, recipientUserId) {
    const { privateKey } = this.keyChain.getKeyForPath('m/2/0');
    const { regTxId, prevSubTx } = await this.getUserRegTxIdAndPrevSubTx(userId);
    const recipientData = await this.getUserRegTxIdAndPrevSubTx(recipientUserId);

    return await createContactRequest(
      Dashcore,
      this.transport.transport,
      this.dapId,
      privateKey,
      regTxId,
      prevSubTx,
      recipientData.regTxId
    );
  }

  async getContactRequests () { //from people that sent requests to current account
    return await require('./getContactRequests')(
      this.transport.transport,
      this.dapId,
    );
  }

  getContactProposals () { //from current account that sent requests to people
    throw new Error('Not implemented');
  }

  async acceptContactRequest (userId, recipientUserId) {
    throw new Error('Not implemented');
  }

  denyContactRequest (opts) {
    throw new Error('Not implemented');
  }

  getIgnoredContacts () {
    throw new Error('Not implemented');
  }

  async removeContact (userId, recipientUserId) {
    throw new Error('Not implemented');
  }

  async getContacts () {
    return await require('./getContacts')(
      this.transport.transport,
      this.dapId,
      this.userId,
    );
  }

  getAccountHistory (opts) { //payments sent,payments received, contacts confirmed, contacts requests canceled etc.
    throw new Error('Not implemented');
  }

};

module.exports = DashPayDAP;
