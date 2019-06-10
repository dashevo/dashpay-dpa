const { expect } = require('chai');
const Profile = require('../../src/Profile/Profile');

const expectedProfile = {
  avatar: 'https://api.adorable.io/avatars/285/abott@adorable.png',
  bio: 'Something that describe myself',
}
describe('DashPay DAP - Profile', () => {
  it('should create an object', () => {
    const profile = new Profile(expectedProfile);
    expect(profile.avatar).to.equal(expectedProfile.avatar)
    expect(profile.bio).to.equal(expectedProfile.bio);
  });
});
