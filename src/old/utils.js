const is = {
  userid: uid => /^[a-f0-9]{64}$/i.test(uid),
};
is.regid = is.userid;

module.exports = {
  is,
};
