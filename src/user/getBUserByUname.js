/**
 * getBUsernameRegistrationId
 * @return {Promise<*>} buser - Blockchain User
 * @param username - default : busername
 */
module.exports = async function getBUserByUname(uname = this.buser.uname) {
  return this.transport.transport.getUserByName(uname);
};
