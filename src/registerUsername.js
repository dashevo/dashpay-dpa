const { doubleSha256 } = require('./utils/crypto');
const Schema = require('@dashevo/dash-schema/dash-schema-lib');

module.exports = async (dashcore, transport, username) => {
  const faucetPrivateKey = new dashcore.PrivateKey('cVwyvFt95dzwEqYCLd8pv9CzktajP4tWH2w9RQNPeHYA7pH35wcJ');
  const faucetPublicKey = dashcore.PublicKey.fromPrivateKey(faucetPrivateKey);
  const privateKey = new dashcore.PrivateKey();
  const faucetAddress = dashcore.Address
    .fromPublicKey(faucetPublicKey, 'testnet')
    .toString();

  const validPayload = new dashcore.Transaction.Payload.SubTxRegisterPayload()
    .setUserName(username)
    .setPubKeyIdFromPrivateKey(privateKey)
    .sign(privateKey);

  const inputs = await transport.getUTXO(faucetAddress);

  const transaction = dashcore.Transaction()
    .setType(dashcore.Transaction.TYPES.TRANSACTION_SUBTX_REGISTER)
    .setExtraPayload(validPayload)
    .from(inputs.slice(-1)[0])
    .addFundingOutput(10000)
    .change(faucetAddress)
    .sign(faucetPrivateKey);

  const regTxId = await transport.sendRawTransaction(transaction.serialize());

  return regTxId;
};