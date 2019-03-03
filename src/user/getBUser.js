/**
 *
 * @param userId - (default : regid)
 * @return {Promise<*>} buser - Blockchain User
 */
module.exports = async function getBUser(userId = this.getBUserRegistrationId()) {
  this.buser = await this.transport.transport.getUserById(userId)
  return buser;
}