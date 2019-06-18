const { expect } = require('chai');
const { Wallet } = require('@dashevo/wallet-lib');
const DashPayDAP = require('../../src/index');

const notRandomButGoodEnoughtForUsername = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, '')
  .substr(0, 5);

const takenUsername = 'unittest_dashpaydap';
const takenUserPrivateKey = '182ab1bf10406fa1f235eff48724316ccb2c0fa10b03e43746e2e644b3e3c5bf';

const takenAliceUsername = 'unittest_dashpaydap_alice';
const takenAlicePrivateKey = '182ab1bf10406fa1f235eff48724316ccb2c0fa10b03e43746e2e644b3e3c5bf';

const takenBobUsername = 'unittest_dashpaydap_bob';
const takenBobPrivateKey = '182ab1bf10406fa1f235eff48724316ccb2c0fa10b03e43746e2e644b3e3c5bf';

// We will use wallet private key for that user, check below
const availableUsername = `unittest_dashpaydap_${notRandomButGoodEnoughtForUsername}`;

let wallet;
let account;



describe('DashPay DAP', function suite() {
  // this.timeout(300000);
  // before((done) => {
  //   const config = {
  //     network: 'testnet',
  //     mnemonic: 'churn toast puppy fame blush fatal dove category item eyebrow nest bulk',
  //     allowSensitiveOperations: true,
  //     plugins: [DashPayDAP],
  //   };
  //
  //   wallet = new Wallet(config);
  //   account = wallet.getAccount();
  //   account.events.on('ready', () => {
  //     done();
  //   });
  // });
  // it('should register the DAP', async () => {
  // For now, this is the real code for test with real network
  // TODO : Mocks
  // const dpd = account.getDAP('dashpaydap');
  // const buser = dpd.buser.create(takenUsername);
  // buser.own(takenUserPrivateKey);
  // await dpd.register(buser);

  // });
  // it('should be able to register a profile', async () => {
  // const dpd = account.getDAP('dashpaydap');
  // const takenBuser = dpd.buser.create(takenUsername);
  // takenBuser.own(takenUserPrivateKey);
  // await takenBuser.synchronize();
  // const profile = dpd.profile.create({
  //   avatar: 'https://api.adorable.io/avatars/285/dashpaydap@adorable.png',
  //   bio: 'Something that describe myself',
  // });
  // await takenBuser.synchronize();
  // profile.setOwner(takenBuser);
  // profile.metadata = undefined;
  //
  // await profile.register();
  // console.log(profile);
  // });
});
