const { map } = require('lodash');

module.exports = function profilesToContactRequest(profiles, profile, isSender = true) {
  const requests = (isSender)
    ? map(profiles, _profile => profile.contactRequest.create({ receiver: _profile }))
    : map(profiles, _profile => profile.contactRequest.create({
      sender: _profile,
      receiver: profile,
    }));
  return requests;
};
