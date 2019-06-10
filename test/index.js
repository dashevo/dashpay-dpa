const { expect } = require('chai');
const { Wallet } = require('@dashevo/wallet-lib');
const DashPayDAP = require('../src/index');

// const notRandomButGoodEnoughtForUsername = Math.random()
//   .toString(36)
//   .replace(/[^a-z]+/g, '')
//   .substr(0, 5);

const takenUsername = 'unittest_dashpaydap';
const takenUserPrivateKey = '182ab1bf10406fa1f235eff48724316ccb2c0fa10b03e43746e2e644b3e3c5bf';

// We will use wallet private key for that user, check below
// const availableUsername = `unittest_dashpaydap_${notRandomButGoodEnoughtForUsername}`;

let wallet;
let account;


// const checkForBroadcasted = async user => new Promise((resolve, reject) => {
//   const int = setInterval(() => {
//     console.log(`Check for broadcast - State ${user.state} - Regtxid ${user.regtxid}`);
//     if (user.state === 'broadcasted') {
//       clearInterval(int);
//       return resolve(true);
//     }
//   }, 150);

//   setTimeout(() => {
//     clearInterval(int);
//     return reject(new Error('Failed to broadcast'));
//   }, 25000);
// });

// const checkForMempool = async user => new Promise((resolve, reject) => {
//   const int = setInterval(() => {
//     console.log(`Check for mempool - State ${user.state} - Mempool ${user.from_mempool}`);
//     if (user.state === 'open' && user.from_mempool) {
//       clearInterval(int);
//       return resolve(true);
//     }
//   }, 400);

//   setTimeout(() => {
//     clearInterval(int);
//     return reject(new Error('Failed to insert in mempool'));
//   }, 25000);
// });

// const checkForMined = async user => new Promise((resolve, reject) => {
//   const int = setInterval(() => {
//     console.log(`Check for mined - State ${user.state} - Mempool ${user.from_mempool}`);
//     if (user.state === 'open' && !user.from_mempool) {
//       clearInterval(int);
//       return resolve(true);
//     }
//   }, 5000);

//   setTimeout(() => {
//     clearInterval(int);
//     return reject(new Error('Failed to mine'));
//   }, 200000);
// });

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
  describe('DashPayDAP', () => {
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
      expect(dpd.dapContract.name)
        .to
        .equal('dashpaydap');
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
  describe('BUser - process', () => {
    before((done) => {
      const balance = account.getBalance(false, false);
      console.log('Trying process in network - Balance check : ', balance);
      if (balance < 100) {
        const { address } = account.getUnusedAddress();
        console.error('Not enought fund for network process, fund me at : ', address);
        throw new Error(`Fund me : ${address}`);
      }
      done();
    });
    it('should be able to deal with unavailable BUser', async () => {
      const dpd = account.getDAP('dashpaydap');
      const buser = dpd.buser.create(takenUsername);
      buser.own(takenUserPrivateKey);
      expect(buser.state)
        .to
        .equal('unknown');
      expect(buser.isOwned)
        .to
        .equal(true);
      await buser.synchronize();
      // Which is the state when registered.
      expect(buser.state)
        .to
        .equal('open');
      // FIXME : Ideally, synchronizing should, if existing, try with passed privateKey
      // and reset isOwned to false if not valid.
      // expect(BUser.isOwned).to.equal(true);
      const expectedException = 'User unittest_dashpaydap already exist on the network. Cannot register.';
      await Promise.resolve(buser.register())
        .then(() => new Error('Expected error'))
        .catch((e) => {
          expect(e.name)
            .to
            .equal('BUserAlreadyExistError');
          expect(e.message)
            .to
            .equal(expectedException);
        });
    });
    //   it('should be able to really register a BUser', async () => {
    //     const dpd = account.getDAP('dashpaydap');
    //     const availableBUser = dpd.BUser.create(availableUsername);
    //
    //     availableBUser.own(dpd.getBUserSigningPrivateKey());
    //     expect(availableBUser.isOwned)
    //       .to
    //       .equal(true);
    //     expect(availableBUser.state)
    //       .to
    //       .equal('unknown');
    //     await availableBUser.synchronize();
    //     expect(availableBUser.isOwned)
    //       .to
    //       .equal(true);
    //     expect(availableBUser.state)
    //       .to
    //       .equal('available');
    //
    //     await availableBUser.register();
    //     await checkForBroadcasted(availableBUser);
    //     await checkForMempool(availableBUser);
    //     return checkForMined(availableBUser);
    //   });
    // });
    it('should be able to really register a profile', async () => {
      const dpd = account.getDAP('dashpaydap');
      // const availableBUser = dpd.buser.create(availableUsername);
      const buser = dpd.buser.create(takenUsername);
      buser.own(takenUserPrivateKey);
      const profile = dpd.profile.create({
        avatar: 'https://api.adorable.io/avatars/285/dashpaydap@adorable.png',
        bio: 'Something that describe myself',
      });
      await buser.synchronize();
      profile.attachBUser(buser);

      await profile.register();
      console.log(profile);
    });
  });
});
