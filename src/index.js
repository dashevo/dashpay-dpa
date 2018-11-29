const { plugins, CONSTANTS, utils } = require('@dashevo/wallet-lib');
const Dashcore = require('@dashevo/dashcore-lib');
const Schema = require('@dashevo/dash-schema/dash-schema-lib');
const dashPaySchema = require('./dashpay.schema.json');
const {doubleSha256} = utils;

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
  async registerUsername(blockchainUsername, funding = 10000) {
    const { address } = this.getUnusedAddress();
    const balance = await this.getBalance();

    if (balance === 0) throw new Error('Insufficient funds');

    // Utxos are returned sorted
    const utxos = await this.getUTXOS();
    if (utxos.length === 0) throw new Error('Insufficient funds');

    // CoinSelection won't calculate anything related to BU as well as the size calculation (TODO)
    // So for now we just do a simple selection and basic fee estimation

    const txFee = CONSTANTS.FEES.PRIORITY;
    const requiredSatoshisForFees = funding + txFee;

    // Let's parse our utxos up to us having at least enought to cover for the fees.
    const filteredUtxosList = [];

    const isEnougthOutputForFees = (list, totalFee) => {
      const total = list.reduce((acc, cur) => acc + cur.satoshis, 0);
      return total >= totalFee;
    };

    for (let i = utxos.length - 1; i >= 0; i++) {
      const utxo = utxos[i];
      filteredUtxosList.push(utxo);
      if (isEnougthOutputForFees(filteredUtxosList, requiredSatoshisForFees)) break;
      if (i === 0) throw new Error('Missing enough utxos to cover the funding fee');
    }

    const availableSat = filteredUtxosList.reduce((acc, cur) => acc + cur.satoshis, 0);

    // We send back to ourself the remaining units that won't be used for funding
    const outputSat = availableSat - requiredSatoshisForFees;
    const outputsList = [{ address, satoshis: outputSat }];

    const { privateKey } = this.keyChain.getKeyForPath('m/2/0');
    const transaction = Dashcore.Transaction().from(filteredUtxosList).to(outputsList);
    transaction.feePerKb(CONSTANTS.FEES.PRIORITY);

    // Prepare the SubRegTx payload
    const payload = new Dashcore.Transaction.Payload.SubTxRegisterPayload()
      .setUserName(blockchainUsername)
      .setPubKeyIdFromPrivateKey(privateKey)
      .sign(privateKey);

    // Attach payload to transaction object
    transaction
      .setType(Dashcore.Transaction.TYPES.TRANSACTION_SUBTX_REGISTER)
      .setExtraPayload(payload)
      .addFundingOutput(funding);

    const privateKeys = this.getPrivateKeys(filteredUtxosList
      .map(item => item.address))
      .map(hdpk => hdpk.privateKey);

    const signedTransaction = transaction.sign(privateKeys, Dashcore.crypto.Signature.SIGHASH_ALL);

    const txid = await this.broadcastTransaction(signedTransaction.toString());
    return txid;
  }

  async searchUsername(pattern) {
    return this.transport.transport.searchUsers(pattern);
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

  createContactRequest (opts) {
    throw new Error('Not implemented');
  }

  getContactRequests () { //from people that sent requests to current account
    throw new Error('Not implemented');
  }

  getContactProposals () { //from current account that sent requests to people
    throw new Error('Not implemented');
  }

  acceptContactRequest (opts) {
    throw new Error('Not implemented');
  }

  denyContactRequest (opts) {
    throw new Error('Not implemented');
  }

  getIgnoredContacts () {
    throw new Error('Not implemented');
  }

  removeContact () {
    throw new Error('Not implemented');
  }

  getContacts (opts) {
    throw new Error('Not implemented');
  }

  getAccountHistory (opts) { //payments sent,payments received, contacts confirmed, contacts requests canceled etc.
    throw new Error('Not implemented');
  }

};

module.exports = DashPayDAP;
