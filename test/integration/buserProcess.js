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


const checkForBroadcasted = async user => new Promise((resolve, reject) => {
  let int = setInterval(() => {
    console.log(`Check for broadcast - State ${user.state} - Regtxid ${user.regtxid}`);
    if (user.state === 'broadcasted') {
      clearInterval(int);
      int = null;
      resolve(true);
    }
  }, 150);

  setTimeout(() => {
    clearInterval(int);
    int = null;
    reject(new Error('Failed to broadcast'));
  }, 25000);
});

const checkForMempool = async user => new Promise((resolve, reject) => {
  let timeout;
  let int = setInterval(() => {
    console.log(`Check for mempool - State ${user.state} - Mempool ${user.from_mempool}`);
    if (user.state === 'open' && user.from_mempool) {
      clearInterval(int);
      clearTimeout(timeout)
      int = null;

      resolve(true);
    }
  }, 400);

  timeout = setTimeout(() => {
    clearInterval(int);
    int = null;
    return reject(new Error('Failed to insert in mempool'));
  }, 25000);
});

const checkForMined = async user => new Promise((resolve, reject) => {
  let timeout;
  let int = setInterval(() => {
    console.log(`Check for mined - State ${user.state} - Mempool ${user.from_mempool}`);
    if (user.state === 'open' && !user.from_mempool) {
      clearInterval(int);
      clearTimeout(timeout)
       int = null;
      resolve(true);
    }
  }, 5000);

  timeout = setTimeout(() => {
    clearInterval(int);
    int = null;
    return reject(new Error('Failed to mine'));
  }, 200000);
});


describe('DashPay DAP - Integration', function suite() {
  this.timeout(300000);
  before((done) => {
    const config = {
      network: 'testnet',
      mnemonic: 'churn toast puppy fame blush fatal dove category item eyebrow nest bulk',
      allowSensitiveOperations: true,
      plugins: [new DashPayDAP({verifyOnInjected:false})],
    };

    wallet = new Wallet(config);
    account = wallet.getAccount();
    account.events.on('ready', () => {
      done();
    });
  });
  describe('BUser - Process', ()=>{
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
    it('should get a buser', async () => {
      const dpd = account.getDAP('dashpaydap');
      const buser = await dpd.buser.get('unittest_username1');
      console.log(buser);
    });
    it('should create a buser', async () => {
      const dpd = account.getDAP('dashpaydap');
      const buser = await dpd.buser.create('unittest_username1');
      console.log(buser);
    });
    it('should synchronize a buser', async () => {
      const dpd = account.getDAP('dashpaydap');
      const buser = await dpd.buser.create('unittest_username1');
      await buser.synchronize();
      console.log(buser);
    });
    it('should do contact lists', async () => {
      const dpd = account.getDAP('dashpaydap');

      // First we want to get our current contact list
      const contactList = await dpd.contact.getAll();

      const pending = false;
      const pendingList = await dpd.contactRequest.getAllPending();

    });
    it('should match get and create+synchronize', async function () {
      const dpd = account.getDAP('dashpaydap');
      const buser = await dpd.buser.get(takenUsername);
      await buser.synchronize()

      const buser2 = await dpd.buser.create(takenUsername);
      await buser2.synchronize();
      expect(buser.state).to.equal(buser2.state);
      expect(buser.username).to.equal(buser2.username);
      expect(buser.regtxid).to.equal(buser2.regtxid);
      expect(buser.pubkeyid).to.equal(buser2.pubkeyid);
      expect(buser.data).to.equal(buser2.data);
      expect(buser.subtx).to.deep.equal(buser2.subtx);
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
    it('should be able to really register a BUser', async () => {
      const dpd = account.getDAP('dashpaydap');
      const availableBUser = dpd.buser.create(availableUsername);

      availableBUser.own(dpd.getBUserSigningPrivateKey());
      expect(availableBUser.isOwned)
        .to
        .equal(true);
      expect(availableBUser.state)
        .to
        .equal('unknown');
      await availableBUser.synchronize();
      expect(availableBUser.isOwned)
        .to
        .equal(true);
      expect(availableBUser.state)
        .to
        .equal('available');

      await availableBUser.register();
      await checkForBroadcasted(availableBUser);
      await checkForMempool(availableBUser);
      return checkForMined(availableBUser);
    });
  })
  after(()=>{
     wallet.disconnect()
  })
});
