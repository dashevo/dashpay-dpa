const BUserNotFoundError = require('../errors/BUserNotFoundError');
const BUser = require('../BUser/BUser');
const { is } = require('../utils');

/**
 * Will get the Blockchain User corresponding to the requested username
 * @param username - the requested username
 * @return {Promise<*>} BUser - Blockchain User
 */
module.exports = async function getBUserByUname(username) {
  if (!username) throw new Error(`Missing Username parameter`);
  if (is.userid(username)) throw new Error('Invalid Username provided. Are you looking for getBUserByUID ?');
  try {
    const buser = await this.transport.transport.getUserByName(username);
    return new BUser(buser);
  } catch (e) {
    const isUserNotFoundError = new RegExp('user.*not.*found.*', 'g');
    if (isUserNotFoundError.test(e.message)) {
      throw new BUserNotFoundError(username);
    } else {
      throw e;
    }
  }
};
