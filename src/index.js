const { Wallet } = require('@dashevo/wallet-lib');
const Dashcore = require('@dashevo/dashcore-lib');

class DashPayDAP {
  constructor(opts){
    this.wallet = null;
    this.account = null;

    this.initiateWallet(opts);
    this.initiatePrimaryAccount();
  }
  initiateWallet(opts){
    this.wallet = new Wallet(opts);
  }
  initiatePrimaryAccount(){
    this.account = this.wallet.createAccount();
  }
  /*
  * Evo L1 stuff
  */

  /**
   * @param {string} username
   * @returns {string} - hex string containing user registration
   */
  createRegistration(username) {
    const privateKey = new PrivateKey(this.keychain.getNewPrivateKey());
    return Registration.createRegistration(username, privateKey).serialize();
  }

  /**
   * @param {string} rawRegistration - hex string representing user registration data
   * @param {number} [funding] - default funding for the account in duffs. Optional.
  If left empty,
   * funding will be 0.
   * @return {string} - user id
   */
  async registerUser(rawRegistration, funding = 0) {
    const regTx = new Dashcore.Registration(rawRegistration);
    const inputs = await this.account.getUTXO();

    regTx.fund(inputs, this.account.getUnusedAddress(), funding);
    const signedTx = this.account.sign(regTx.serialize());
    return this.account.broadcastTransaction(signedTx);
  }

  /**
   * @param {string} userId
   * @param {number} amount - top up amount in duffs
   * @return {Promise<string>} - tx id
   */
  async topUpUserCredits(userId, amount) {
    const subTx = new Dashcore.TopUp();
    const inputs = await this.account.getUTXO();

    subTx.fund(userId, amount, inputs, this.account.getUnusedAddress());
    const signedTx = this.account.sign(subTx);
    return this.account.broadcastTransaction(signedTx);
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
