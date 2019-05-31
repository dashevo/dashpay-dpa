const { Wallet } = require('@dashevo/wallet-lib');

const DashPayDAP = require('../src/index');

let wallet;
let account;
describe('DashPay DAP', function suite() {
  this.timeout(60000);
  before((done) => {
    const config = {
      network: 'testnet',
      mnemonic: 'churn toast puppy fame blush fatal dove category item eyebrow nest bulk',
      allowSensitiveOperations: true,
      plugins: [DashPayDAP],
    };

    wallet = new Wallet(config);
    account = wallet.getAccount();
    account.events.on('ready', () => {
      done();
    });
  });
});
