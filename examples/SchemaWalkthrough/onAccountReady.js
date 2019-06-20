const onAccountReady = async (account) => {
  console.log('DashPay DAP - Started');
  const dpd = account.getDAP('dashpaydap');

  /**
   * This will walkthrough the registration of our schema.
   * First we need a owner.
   */

  const buser = dpd.buser.create('dashpaydpa_schema_owner');
  await buser.synchronize();
  buser.own(dpd.getBUserSigningPrivateKey());
  // const txid = (await dpd.register(buser));
  //txid : a6c14cffd0ec539d77a4cb118cae3f070086a84ef9be040e4a3ff0ddf5377491';

  const contractId = dpd.dpp.getContract().getId();
  console.log(contractId)
  /**
   * Let's check the id
   *
   */
  console.log(await dpd.transport.transport.fetchContract(contractId));
};
module.exports = onAccountReady;
