const { expect } = require('chai');
const DashPayDAP  = require('../src/index');

let dashpay = null;
let account = null;
const mnemonic = "";


describe('DashPay DAP', function suite() {
  this.timeout(60000);
  before((done) => {
    const config = {
      network: 'testnet',
      mnemonic: 'churn toast puppy fame blush fatal dove category item eyebrow nest bulk'
  };
    dashpay = new DashPayDAP(config);
    account = dashpay.wallet.createAccount();
    account.events.on('ready', () => {
      done();
    });
  });
  it('should be able to create a blockchain username', () => {
  });
  it('should be able to pay to a username', () => {

  });
});