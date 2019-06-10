const Dashcore = require('@dashevo/dashcore-lib');
const { CONSTANTS } = require('@dashevo/wallet-lib');

const { convertPrivateKeyToPubKeyId } = Dashcore.Transaction.Payload.SubTxRegisterPayload;
/**
* @param {string} username - string representation of the user desired username
* @param {number} [funding] - default funding for the account in duffs. Optional.
* If left empty funding will be 10000.
* @return {user} - user object
*/
module.exports = async function registerBUser(uname, funding = 10000) {
  // Utxos are returned sorted
  const utxos = await this.getUTXOS();
  if (utxos.length === 0) throw new Error('Insufficient funds');

  // CoinSelection won't calculate anything related to BU as well as the size calculation (TODO)
  // So for now we just do a simple selection and basic fee estimation

  const txFee = CONSTANTS.FEES.NORMAL;
  const requiredSatoshisForFees = funding + txFee;

  // Let's parse our utxos up to us having at least enougth to cover for the fees.
  const filteredUtxosList = [];

  const isEnougthOutputForFees = (list, totalFee) => {
    const total = list.reduce((acc, cur) => acc + cur.satoshis, 0);
    return total >= totalFee;
  };

  for (let i = utxos.length - 1; i >= 0; i -= 1) {
    const utxo = utxos[i];
    filteredUtxosList.push(utxo);
    if (isEnougthOutputForFees(filteredUtxosList, requiredSatoshisForFees)) break;
    if (i === 0) throw new Error('Missing enough utxos to cover the funding fee');
  }

  const availableSat = filteredUtxosList.reduce((acc, cur) => acc + cur.satoshis, 0);

  // We send back to ourself the remaining units that won't be used for funding
  const outputSat = availableSat - requiredSatoshisForFees;
  const outputsList = [{ address, satoshis: outputSat }];

  const { privateKey } = this.keyChain.getKeyForPath('m/2/0');
  const transaction = Dashcore.Transaction().from(filteredUtxosList).to(outputsList);
  transaction.feePerKb(CONSTANTS.FEES.PRIORITY);

  // Prepare the SubRegTx payload
  const payload = new Dashcore.Transaction.Payload.SubTxRegisterPayload()
    .setUserName(uname)
    .setPubKeyIdFromPrivateKey(privateKey)
    .sign(this.getBUserPrivateKey());

  // Attach payload to transaction object
  transaction
    .setType(Dashcore.Transaction.TYPES.TRANSACTION_SUBTX_REGISTER)
    .setExtraPayload(payload)
    .addFundingOutput(funding);

  const privateKeys = this.getPrivateKeys(filteredUtxosList
    .map(item => item.address))
    .map(hdpk => hdpk.privateKey);

  const signedTransaction = transaction.sign(privateKeys, Dashcore.crypto.Signature.SIGHASH_ALL);

  const regtxid = await this.broadcastTransaction(signedTransaction.toString());

  const pubkeyid = convertPrivateKeyToPubKeyId(privateKey).toString('hex');

  this.buser = {
    uname,
    regtxid,
    pubkeyid,
    credits: funding,
    state: 'broadcasted',
    subtx: [regtxid],
    data: null, // We probably can get this one too (hash of whole ?).
  };

  return this.buser;
};
