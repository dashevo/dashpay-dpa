const { is } = require('../utils');

/**
 * Return the BUserRegistrationID from a username or a userid.
 * @param identifier - A username or userid
 * @return {Promise<*>} buser - Blockchain User
 */
module.exports = async function getBUserRegistrationId(identifier) {
  if (!identifier) throw new Error('Missing username or userid.');
  const isUid = (is.userid(identifier));
  const buser = await (isUid ? this.getBUserByUID(identifier) : this.getBUserByUname(identifier));
  return buser.regtxid;
};
