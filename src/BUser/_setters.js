// Very soon, we hope to have to verification / validation in place.
// Therefore, having all the setters here will help.
// We call it, in order to have our `this` prop.
// `setters.setUsername.call(this, username)`
const setters = {
  setUsername(username) {
    this.username = username;
  },
  setState(state) {
    this.state = state;
  },
  setRegTxId(regtxid) {
    this.regtxid = regtxid;
  },
  setPubKeyId(pubkeyid) {
    this.pubkeyid = pubkeyid;
  },
  setCredits(credits) {
    this.credits = credits;
  },
  setSubTx(subtx) {
    this.subtx = subtx;
  },
  setIsOwned(isowned, replace = false) {
    // When we call dpd.get(), we pass network information to BUSer, therefore we inherits default opts
    // Which for isOwned is false. Let's keep real value except if replace is true.
    if (this.isOwned === true && isowned === false && !replace) {
      return;
    }
    this.isOwned = isowned;
  },
  setData(data) {
    this.data = data;
  },
  setSynchronizedLast(synclast) {
    this.synchronizedLast = synclast;
  },
};
// Aliases
// Aliases
setters.setUname = setters.setUsername;
setters.setRegtxid = setters.setRegTxId;
setters.setPubkeyid = setters.setPubKeyId;
setters.setSubtx = setters.setSubTx;


module.exports = setters;
