const onAccountReady = async (account) => {
  console.log('DashPay DAP - Started');
  const dpd = account.getDAP('dashpaydap');

  /**
   * We first look up to see if a schema exist
   */
  const contractId = dpd.dpp.getContract().getId();
  try {
    const contract = await dpd.transport.transport.fetchContract(contractId);
    console.log(contract);
  } catch (e) {
    /**
     * Contract do not exist, let's register it
     */

    /**
     * This will walkthrough the registration of our schema.
     * First we need a owner.
     */
    const buser = dpd.buser.create('dashpaydpa_schema_owner');
    await buser.synchronize();
    buser.own(dpd.getBUserSigningPrivateKey());


    const contractTxId = (await dpd.register(buser));
    // txid : 913b76f95aa763c6e5e25a716b5750731407e0955620b4ef9a061141b42f42eb';

    console.log(contractTxId);
  }
};
module.exports = onAccountReady;
