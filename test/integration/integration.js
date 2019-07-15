const { expect } = require('chai');
const { Wallet } = require('@dashevo/wallet-lib');
const DashPayDPA = require('../../src/index');

const notRandomButGoodEnoughtForUsername = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, '')
  .substr(0, 5);

const takenUsername = 'unittest_dashpaydpa';
const takenUserPrivateKey = '182ab1bf10406fa1f235eff48724316ccb2c0fa10b03e43746e2e644b3e3c5bf';

const takenAliceUsername = 'unittest_dashpaydpa_alice';
const takenAlicePrivateKey = '182ab1bf10406fa1f235eff48724316ccb2c0fa10b03e43746e2e644b3e3c5bf';

const takenBobUsername = 'unittest_dashpaydpa_bob';
const takenBobPrivateKey = '182ab1bf10406fa1f235eff48724316ccb2c0fa10b03e43746e2e644b3e3c5bf';

// We will use wallet private key for that user, check below
const availableUsername = `unittest_dashpaydpa_${notRandomButGoodEnoughtForUsername}`;

let wallet;
let account;



describe('DashPay DPA', function suite() {
  // this.timeout(300000);
  // before((done) => {
  //   const config = {
  //     network: 'testnet',
  //     mnemonic: 'churn toast puppy fame blush fatal dove category item eyebrow nest bulk',
  //     allowSensitiveOperations: true,
  //     plugins: [DashPayDPA],
  //   };
  //
  //   wallet = new Wallet(config);
  //   account = wallet.getAccount();
  //   account.events.on('ready', () => {
  //     done();
  //   });
  // });
  // it('should register the DPA', async () => {
  // For now, this is the real code for test with real network
  // TODO : Mocks
  // const dpd = account.getDPA('dashpaydpa');
  // const buser = dpd.buser.create(takenUsername);
  // buser.own(takenUserPrivateKey);
  // await dpd.register(buser);

  // });
  // it('should be able to register a profile', async () => {
  // const dpd = account.getDPA('dashpaydpa');
  // const takenBuser = dpd.buser.create(takenUsername);
  // takenBuser.own(takenUserPrivateKey);
  // await takenBuser.synchronize();
  // const profile = dpd.profile.create({
  //   avatar: 'https://api.adorable.io/avatars/285/dashpaydpa@adorable.png',
  //   about: 'Something that describe myself',
  // });
  // await takenBuser.synchronize();
  // profile.setOwner(takenBuser);
  // profile.metadata = undefined;
  //
  // await profile.register();
  // console.log(profile);
  // });
});
