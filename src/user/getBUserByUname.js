/**
 * getBUsernameRegistrationId
 * @return {Promise<*>} buser - Blockchain User
 * @param username - default : busername
 */
module.exports = async function getBUserByUname(uname = this.buser.uname) {
  const buser = await this.transport.transport.getUserByName(uname)
  return buser;
}