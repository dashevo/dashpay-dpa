module.exports = async function getBUserPreviousSTID(userId = null) {
  const id = (userId === null) ? await this.getBUserRegistrationId() : userId;
  const userData = await this.transport.transport.getUserById(id);
  const previousSTID = userData.subtx.pop() || userData.regtxid;
  return previousSTID;
};
