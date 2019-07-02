module.exports = async function getByBUsername(busername) {
  const buser = await this.buserFacade.get(busername);
  if (buser) {
    return this.getByBUser(buser);
  }
  return false;
}
