module.exports = async function isSchemaRegistered() {
  let isRegistered = false;

  console.log(this.dapContract.hash())
  console.log(this.dapContract.getId())

  const res = await this.transport.transport.fetchContract(this.dapContract.getId())
  // const res2 = await this.transport.transport.fetchContract(this.dapContract.hash())
  console.log(res);


  try {
    const dapContractFromDAPI = await this.transport.transport.fetchContract(
      this.dpp.getContract().getId(),
    );
    if (dapContractFromDAPI && dapContractFromDAPI.dapname === 'DashPay') {
      isRegistered = true;
    }
  } catch (e) {
    if (e.message !== 'DAPI RPC error: fetchContract: Error: DAPI RPC error: fetchContract: Dap Contract not found') {
      console.log('Unexpected error', e);
    }
  }
  return isRegistered;
};
