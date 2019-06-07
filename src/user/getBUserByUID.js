const BUserNotFoundError = require('../errors/BUserNotFoundError');
const { is } = require('../utils');
/**
 *
 * @param userId - (default : regid)
 * @return {Promise<*>} buser - Blockchain User
 */
module.exports = async function getBUserByUID(userId = this.getBUserRegistrationId()) {
  if (!is.userid(userId)) throw new Error('Invalid UserID provided. Are you looking for getBUserByUname ?');
  try {
    const buser = await
      this.transport.transport.getUserById(userId);
    this.buser = buser;
    return buser;
  } catch (e) {
    const isUserNotFoundError = new RegExp('user.*not.*found.*', 'g');
    if (isUserNotFoundError.test(e.message)) {
      throw new BUserNotFoundError(userId);
    } else {
      throw e;
    }
  }
};
