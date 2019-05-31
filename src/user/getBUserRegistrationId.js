/**
 * getBUserIdRegistrationId
 * @return {Promise<*>} buser - Blockchain User
 * @param username - default : busername
 */
module.exports = async function getBUserIdRegistrationId(userID = this.buser.id) {
  const buser = await this.transport.transport.getUserById(userID);
  return buser.regtxid;
};
