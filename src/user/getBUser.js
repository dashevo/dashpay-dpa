/**
 *
 * @param userId - (default : regid)
 * @return {Promise<*>} buser - Blockchain User
 */
module.exports = async function getBUser(userId = this.getBUserRegistrationId()) {
  const buser = await this.transport.transport.getUserById(userId);
  this.buser = buser;
  return buser;
};
