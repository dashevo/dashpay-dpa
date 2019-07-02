const { expect } = require('chai');
const { Wallet } = require('@dashevo/wallet-lib');
// const { Wallet } = require('../../dash-wallet-lib');
const DashPayDAP = require('../src/index');

let wallet;
let account;

describe('DashPay DAP', function suite() {
  this.timeout(300000);
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
  it('should fetch a contract', async ()=>{
  const contract = await account.transport.transport.fetchContract('2TRFRpoGu3BpBKfFDmhbJJdDPzLdW4qbdfebkbeCHwj3');
  const contract2 = await account.transport.transport.fetchContract('ypb95xVCHUmXNbNtUP83844qoMJcYd8dyn7QcDuiSyi');
  console.log(contract);
  console.log(contract2);
  })
  it('should get the plugin ', () => {
    const dpd = account.getDAP('dashpaydap');
    expect(dpd.pluginType)
      .to
      .equal('DAP');
    expect(dpd.type)
      .to
      .equal('DAP');
    expect(dpd.isValid)
      .to
      .equal(false);// FIXME
    expect(dpd.name)
      .to
      .equal('DashPayDAP');
    expect(dpd.transport.isValid)
      .to
      .equal(true);

    /* eslint-disable no-unused-expressions */
    expect(dpd.getPrivateKeys).to.exist;
    expect(dpd.keyChain).to.exist;
    expect(dpd.sign).to.exist;
  });
  it('should have BUser method', () => {
    const dpd = account.getDAP('dashpaydap');
    expect(dpd.buser).to.exist;
    expect(dpd.buser.transporter).to.exist;
    expect(dpd.buser.transporter.constructor.name)
      .to
      .equal('DAPIClient');

    expect(dpd.buser.create)
      .to
      .be
      .a('function');
    expect(dpd.buser.get)
      .to
      .be
      .a('function');
  });
  it('should be able to create', () => {
    const dpd = account.getDAP('dashpaydap');
    const buser = dpd.buser.create('dashpaytest');
    expect(buser.constructor.name)
      .to
      .equal('BUser');
  });
});
