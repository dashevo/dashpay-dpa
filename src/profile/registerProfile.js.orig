const Dashcore = require('@dashevo/dashcore-lib');
const Schema = require('@dashevo/dash-schema/dash-schema-lib');
const { doubleSha256 } = require('../utils/crypto.js');
const dapschema = require('../schema/dashpay.schema');
const { utils } = require('@dashevo/wallet-lib');


/**
 *
 * @param avatar - b64 representation or url of the avatar
 * @param bio - string
 * @param displayName - string
 * @param props - string - stringified object of additional props.
 * @return {Promise<string>}
 */
module.exports = async function registerProfile(avatar = '', bio = '', displayName = '', bUserName = '') {
  if (this.buser === null) {
    try {
      this.buser = await this.getBUserByUname(this.username);
    } catch (e) {
      throw new Error('BUser not registered. Can\'t register profile');
    }
  }

  // We prepare our object
  const profile = Schema.create.dapobject('profile');

  profile.act = 0;
  Object.assign(profile, {
    avatar,
    displayName,
    bUserName,
    bio,
  });

  const {
    serializedTransaction,
    serializedPacket,
  } = this.prepareStateTransition(profile, this.buser, this.getBUserPrivateKey().toString('hex'));

  const txid = await this.broadcastTransition(
    serializedTransaction, serializedPacket,
  );
  // const txid = 0;

  console.log(`Profile ${displayName}  Registered (txid ${txid}.`);
  return txid;
};
