module.exports = async function isSchemaRegistered() {
  let isRegistered = false;
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
