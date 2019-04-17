/**
 * getBUserRegistrationId
 * @return {Promise<*>} buser - Blockchain User
 * @param username - default : busername
 */
module.exports = async function getBUserRegistrationId(username = this.buser.uname) {
  const buser = await this.transport.transport.getUserByName(username)
  return buser.regtxid;
}