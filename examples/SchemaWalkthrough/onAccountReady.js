const onAccountReady = async (account) => {
  console.log('DashPay DPA - Started');
  const dpd = account.getDPA('dashpaydpa');
  console.log(account.getTotalBalance());

  // console.log(await account.getTransactionHistory());

  /**
   * We first look up to see if a schema exist
   */
  const contractId = dpd.dpp.getContract().getId();
  try {
    const contract = await dpd.transport.transport.fetchContract(contractId);
    console.log(contractId, contract);
    console.log(contract.documents.profile);
  } catch (e) {
    /**
     * Contract do not exist, let's register it
     */

    /**
     * This will walkthrough the registration of our schema.
     * First we need a owner.
     */
    // const buser = dpd.buser.create('dashpaydpa_schema_owner');
    const buser = dpd.buser.create('dashpaydpa_schema_owner2');
    await buser.synchronize();
    console.log(account.getConfirmedBalance());
    buser.own(dpd.getBUserSigningPrivateKey());
    // const contractTxId = await buser.register();

    // const contractTxId = (await dpd.register(buser));
    // txid : 9caf16eb6f304e9fbc7ba2c1c6d79265a35d89c0f6068045edc090cd06fb83e7';
    console.log(account.getTotalBalance( true));
    // console.log(contractTxId);
  }
};
module.exports = onAccountReady;
