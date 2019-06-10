const Dashcore = require('@dashevo/dashcore-lib');
const { utils } = require('@dashevo/wallet-lib');

module.exports = async function topUpBUser(funding = 10000) {
  const dapid = this.dapId;
  console.log(`DAP ID : ${dapid}`);

  // Prepare the SubRegTx payload
  const payload = new Dashcore.Transaction.Payload.SubTxTopupPayload()
    .setRegTxId(this.buser.regtxid)
    .sign(this.getBUserPrivateKey());

  const transaction = new Dashcore.Transaction()
    .setType(Dashcore.Transaction.TYPES.TRANSACTION_SUBTX_TOPUP)
    .setExtraPayload(payload)
    .addFundingOutput(funding);

  const utxo = this.getUTXOS();
  const { address } = this.getUnusedAddress();

  const selection = utils.coinSelection(utxo, [{ address, satoshis: funding }]);

  transaction
    .from([utxo])
    .to([{ address, satoshis: selection.utxosValue - funding - selection.estimatedFee }]);

  const privateKeys = this.getPrivateKeys(
    selection.utxos
      .map(item => item.address)
      .map(hdpk => hdpk.privateKey),
  );

  const signedTransaction = transaction.sign(privateKeys);

  const txid = await this.broadcastTransaction(signedTransaction.toString());
  console.log(`User ${this.buser.uname} toped up ${funding} (txid ${txid}.`);
  return txid;
};
