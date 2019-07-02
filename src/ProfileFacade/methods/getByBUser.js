module.exports = async function getByBUser(buser) {
  if (buser && buser.regtxid) {
    return this.getByUserId(buser.regtxid);
  }
  return false;
};
