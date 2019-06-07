const BUserNotFoundError = require('../errors/BUserNotFoundError');
const { is } = require('../utils');

/**
 * getBUsernameRegistrationId
 * @return {Promise<*>} buser - Blockchain User
 * @param username - default : busername
 */
module.exports = async function getBUserByUname(uname = this.buser.uname) {
  if (is.userid(uname)) throw new Error('Invalid Username provided. Are you looking for getBUserByUID ?');
  try {
    const buser = await this.transport.transport.getUserByName(uname);
    this.buser = buser;
    return buser;
  } catch (e) {
    const isUserNotFoundError = new RegExp('user.*not.*found.*', 'g');
    if (isUserNotFoundError.test(e.message)) {
      throw new BUserNotFoundError(uname);
    } else {
      throw e;
    }
  }
};
