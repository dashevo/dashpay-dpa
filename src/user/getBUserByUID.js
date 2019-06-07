const BUserNotFoundError = require('../errors/BUserNotFoundError');
const BUser = require('../BUser/BUser');
const { is } = require('../utils');

/**
 * Will get the Blockchain User corresponding to the userid
 * @param userId - the requested userID (or regId)
 * @return {Promise<*>} buser - Blockchain User
 */
module.exports = async function getBUserByUID(userId) {
  if (!userId) throw new Error('Missing userID.');
  if (!is.userid(userId)) throw new Error('Invalid UserID provided. Are you looking for getBUserByUname ?');
  try {
    const buser = await this.transport.transport.getUserById(userId);
    return new BUser(buser);
  } catch (e) {
    const isUserNotFoundError = new RegExp('user.*not.*found.*', 'g');
    if (isUserNotFoundError.test(e.message)) {
      throw new BUserNotFoundError(userId);
    } else {
      throw e;
    }
  }
};
