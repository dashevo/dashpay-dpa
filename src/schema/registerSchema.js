const Dashcore = require('@dashevo/dashcore-lib');
const Schema = require('@dashevo/dash-schema/dash-schema-lib');
const { doubleSha256 } = require('../utils/crypto.js');
const dapschema = require('../schema/dashpay.schema');
const { utils } = require('@dashevo/wallet-lib');

module.exports = async function registerSchema(regTxId, regTxPrivKey, prevStId) {
  const creditFeeSet = 1000;

  const dapContract = this.dapContract;
  const dapid = this.dapId
  console.log(`DAP ID : ${dapid}`);

  // We prepare our state transition
  const stPacket = Schema.create.stpacket(dapContract);

  const transaction = new Dashcore.Transaction()
    .setType(Dashcore.Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION);

  const serializedPacket = Schema.serialize.encode(stPacket);
  const stPacketHash = doubleSha256(serializedPacket).toString('hex');

  const payload = transaction.extraPayload
    .setRegTxId(regTxId)
    .setHashPrevSubTx(prevStId)
    .setHashSTPacket(stPacketHash)
    .setCreditFee(creditFeeSet)
    .sign(regTxPrivKey);


  // Attach payload to transaction object
  transaction
    .setExtraPayload(payload);


  const utxo = this.getUTXOS();
  const { address } = this.getUnusedAddress();

  const selection = utils.coinSelection(utxo, [{ address, satoshis: creditFeeSet }]);

  transaction
    .from([utxo])
    .to([{ address, satoshis: selection.utxosValue - creditFeeSet - selection.estimatedFee }]);

  const privateKeys = this.getPrivateKeys(
    selection.utxos
      .map(item => item.address)
      .map(hdpk => hdpk.privateKey),
  );

  const signedTransaction = transaction.sign(privateKeys);
  const rawTransition = signedTransaction.toString();
  const rawTransitionPacket = serializedPacket.toString('hex');
  const txid = await this.broadcastTransition(rawTransition, rawTransitionPacket);
  console.log(`DAP ${dapContract.dapcontract.dapname} (ID:${dapid}) Registered (txid ${txid}.`);
  return txid;
};
