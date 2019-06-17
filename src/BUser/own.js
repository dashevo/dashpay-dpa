module.exports = function own(privateKey) {
  console.log('Owning the BUser with privatekey', privateKey.toString());
  this.privateKey = privateKey.toString();
  // Todo : Either here or on synchronize method, we should actually test if that is a
  // valid key :)
  this.isOwned = true;
}
