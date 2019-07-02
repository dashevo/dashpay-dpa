const { expect } = require('chai');
const { Wallet } = require('@dashevo/wallet-lib');
const DashPayDAP = require('../../src/index');

const takenAliceUsername = 'unittest_dashpaydap_alice';
const takenAlicePrivateKey = '182ab1bf10406fa1f235eff48724316ccb2c0fa10b03e43746e2e644b3e3c5bf';

const takenBobUsername = 'unittest_dashpaydap_bob';
const takenBobPrivateKey = '182ab1bf10406fa1f235eff48724316ccb2c0fa10b03e43746e2e644b3e3c5bf';

let wallet;
let account;


return;

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
  describe('Contact Request - Process', ()=>{
    it('should be able to create a new contact request', async () => {
      const dpd = account.getDAP('dashpaydap');
      const aliceBUser = await dpd.buser.create(takenAliceUsername);
      await aliceBUser.synchronize();
      aliceBUser.own(takenAlicePrivateKey);


      const bobBUser = await dpd.buser.create('buser')
      await bobBUser.synchronize();
      bobBUser.own(takenBobPrivateKey);

      const contactRequest = dpd.contactRequest.create({receiver:bobBUser, sender:aliceBUser});
      expect(contactRequest).to.exist;
    });
    it('should be able to send a new contact request', async ()=>{
      const dpd = account.getDAP('dashpaydap');
      const aliceBUser = await dpd.buser.create(takenAliceUsername);
      await aliceBUser.synchronize();
      aliceBUser.own(takenAlicePrivateKey);

      const bobBUser = await dpd.buser.create('buser')
      await bobBUser.synchronize();
      bobBUser.own(takenBobPrivateKey);

      const contactRequest = dpd.contactRequest.create({receiver:bobBUser, sender:aliceBUser});
      //Fixme : STPCKET issue here
      // console.log('contactreqsend', await contactRequest.send());
    })

    it('should be able to get all pending contact request', async () => {
      const dpd = account.getDAP('dashpaydap');
      const pendingRequest = await dpd.contactRequest.getAllPending();

      console.log(pendingRequest);
    });
    it('should be able to get all denied contact request', async () => {
      const dpd = account.getDAP('dashpaydap');
      const deniedRequest = await dpd.contactRequest.getAllDenied();
      expect(deniedRequest).to.exist;
    });
    it('should be able to get all deleted contact request', async () => {
      const dpd = account.getDAP('dashpaydap');
      const deletedRequest = await dpd.contactRequest.getAllDeleted();
      expect(deletedRequest).to.exist;
    });
  })
  after(()=>{
    wallet.disconnect()
  })
});
