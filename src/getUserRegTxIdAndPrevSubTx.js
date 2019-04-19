module.exports = async (transport, userId) => {
  const userData = await transport.getUserById(userId);
  const prevSubTx = userData.subtx.slice(-1).pop() || userData.regtxid;
  return { regTxId: userData.regtxid, prevSubTx };
};
