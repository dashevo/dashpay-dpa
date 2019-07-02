const { map } = require('lodash');

module.exports = async function profilesToContactRequest(profiles, profile, isSender = true) {
  const requests = (isSender)
    ? map(profiles, _profile => profile.contactRequest.create({ receiver: _profile }))
    : map(profiles, _profile => profile.contactRequest.create({
      sender: _profile,
      receiver: profile,
    }));

  await Promise.all(map(requests, async (request) => {
    if (!request.sender.buser) {
      request.sender.buser = await profile.buser.getById(request.sender.$meta.userId);
    }
  }));
  return requests;
  // return map(requests, reqType => map(reqType, _profile => console.log(_profile) && _profile));
};
