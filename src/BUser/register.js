const Dashcore = require('@dashevo/dashcore-lib');
const STATES = require('./STATES');
const _setters = require('./_setters');

const { convertPrivateKeyToPubKeyId } = Dashcore.Transaction.Payload.SubTxRegisterPayload;
const { CONSTANTS } = require('@dashevo/wallet-lib');

async function launchMinedIntervalChecker() {
  const self = this;
  const minedInterval = setInterval(async () => {
    console.log('minedInterval check by sync');
    await self.synchronize();
    if (!self.from_mempool && self.state === STATES.OPEN) {
      clearInterval(minedInterval);
      return true;
    }
  }, 10 * 1000);
}

async function launchMempoolIntervalChecker() {
  const self = this;
  const mempoolInterval = setInterval(async () => {
    console.log('Mempool check by sync');
    await self.synchronize();
    if (self.state === STATES.OPEN) {
      clearInterval(mempoolInterval);
      // if(self.from_mempool)
      await launchMinedIntervalChecker.call(self);
    }
  }, 1 * 1000);
}
module.exports = async function register(funding = 10000) {
  const canRegister = this.canRegister();
  if (!canRegister) return canRegister;

  const { address } = this.getUnusedAddress();
  const balance = await this.getBalance();
  if (balance === 0 || balance < funding) throw new Error('Insufficient funds to register');

  // Utxos are returned sorted
  const utxos = await this.getUTXOS();
  if (utxos.length === 0) throw new Error('No UTXO available in the Set to chose for registering.');


  console.log('Registering...');

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
  const outputsList = [{
    address,
    satoshis: outputSat,
  }];

  const privateKey = this.getBUserSigningPrivateKey();
  if (!privateKey) throw new Error('Missing private key, got :', privateKey);
  const transaction = Dashcore.Transaction()
    .from(filteredUtxosList)
    .to(outputsList);
  transaction.feePerKb(CONSTANTS.FEES.PRIORITY);

  // Prepare the SubRegTx payload
  const payload = new Dashcore.Transaction.Payload.SubTxRegisterPayload()
    .setUserName(this.username)
    .setPubKeyIdFromPrivateKey(privateKey)
    .sign(privateKey);

  // Attach payload to transaction object
  transaction
    .setType(Dashcore.Transaction.TYPES.TRANSACTION_SUBTX_REGISTER)
    .setExtraPayload(payload)
    .addFundingOutput(funding);

  const privateKeys = this.getPrivateKeys(filteredUtxosList
    .map(item => item.address))
    .map(hdpk => hdpk.privateKey);

  const signedTransaction = transaction.sign(privateKeys, Dashcore.crypto.Signature.SIGHASH_ALL);

  try {
    console.log('Signed', signedTransaction);
    const regtxid = await this.broadcastTransaction(signedTransaction.toString());
    console.log('Broadcasted! RegTxId :', regtxid);
    const pubkeyid = convertPrivateKeyToPubKeyId(privateKey)
      .toString('hex');

    const state = STATES.BROADCASTED;
    _setters.setState.call(this, state);
    const subtx = [regtxid];
    _setters.setRegTxId.call(this, regtxid);
    _setters.setPubKeyId.call(this, pubkeyid);
    _setters.setCredits.call(this, funding);
    _setters.setSubTx.call(this, subtx);

    // We manually keep synchronizing every 5s until we got in mempool then in block
    await launchMempoolIntervalChecker.call(this);
  } catch (e) {
    console.log('E', e);
  }
};
