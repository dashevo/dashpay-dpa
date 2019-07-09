const { expect } = require('chai');
const Profile = require('../../src/Profile/Profile');
const BUser = require('../../src/BUser/BUser');

const expectedProfile = {
  about: 'Something that describe myself',
  avatarUrl: 'https://api.adorable.io/avatars/285/abott@adorable.png',
  $meta:{userId:'1234e'},
};
const expectedProfile2 = {
  about: 'Something that still describe myself',
  avatarUrl: 'https://api.adorable.io/avatars/285/ttoba@adorable.png',
  $meta:{userId:'1234ef'},
};
const expectedBUser = {
  state: 'unknown',
  isOwned: false,
  synchronizedLast: 1560692038513,
  username: 'unittest_username1',
};
describe('DashPay DPA - Profile', () => {
  it('should create an profile', () => {
    const profile = new Profile(expectedProfile);
    expect(profile.avatarUrl)
      .to
      .equal(expectedProfile.avatarUrl);
    expect(profile.about)
      .to
      .equal(expectedProfile.about);

    const profile2 = new Profile(expectedProfile2);
    expect(profile2.avatarUrl)
      .to
      .equal(expectedProfile2.avatarUrl);
    expect(profile2.about)
      .to
      .equal(expectedProfile2.about);
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
    const profile2 = new Profile(profile1)
    expect(profile1.toJSON())
      .to
      .be.deep.equal(profile2.toJSON());
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
    // console.log(profile);


    // console.log(buser);
    // await profile.register();
  });
});
