const { expect } = require('chai');
const Profile = require('../../src/Profile/Profile');
const BUser = require('../../src/BUser/BUser');

const expectedProfile = {
  avatar: 'https://api.adorable.io/avatars/285/abott@adorable.png',
  bio: 'Something that describe myself',
};
const expectedBUser = {
  state: 'unknown',
  isOwned: false,
  synchronizedLast: 1560692038513,
  username: 'unittest_username1',
};
describe('DashPay DAP - Profile', () => {
  it('should create an profile', () => {
    const profile = new Profile(expectedProfile);
    expect(profile.avatar)
      .to
      .equal(expectedProfile.avatar);
    expect(profile.bio)
      .to
      .equal(expectedProfile.bio);
  });
  it('should export', () => {
    const profile = new Profile(expectedProfile);
    const json = profile.toJSON();
    expect(json)
      .to
      .be
      .deep
      .equal(JSON.stringify(expectedProfile));
  });
  it('should clone', () => {
    const profile1 = new Profile(expectedProfile);
    const profile2 = new Profile(profile1);
    expect(profile1)
      .to
      .be
      .deep
      .equal(profile2);
  });
  it('should set an owner and init DPP when needed', () => {
    const buser = new BUser(expectedBUser);
    const profile = new Profile(expectedProfile);
    expect(buser.dpp).to.not.exist;
    profile.setOwner(buser);
    expect(buser.dpp).to.exist;
  });
  it('should error out when registering without a buser set', () => {
    const profile = new Profile(expectedProfile);
    const expectedException = 'Require to first attach a buser to profile';
    expect(() => (async () => await profile.register())
      .to
      .throw(expectedException));
  });
  it('should error out when buser not sync', () => {
    const buser = new BUser(expectedBUser);
    const profile = new Profile(expectedProfile);
    profile.setOwner(buser);
    const expectedException = 'Expected state to be open. Are you sync ?';
    expect(() => (async () => await profile.register())
      .to
      .throw(expectedException));
  });
  it('should register', async () => {
    const buser = new BUser(expectedBUser);
    const profile = new Profile(expectedProfile);
    expect(buser.dpp).to.not.exist;
    // await buser.synchronize();
    profile.setOwner(buser);
    expect(buser.dpp).to.exist;
    console.log(profile);


    console.log(buser);
    // await profile.register();
  });
});
