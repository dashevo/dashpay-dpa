const isSchemaRegistered = async function () {
  const isRegistered = false;
  console.log('Schema', this.dapId)
  try {
    const dapContractFromDAPI = await this.transport.transport.fetchDapContract(this.dapId);
    console.log('isRegistered', dapContractFromDAPI);
  } catch (e) {
    if (e.message !== 'DAPI RPC error: fetchDapContract: Error: DAPI RPC error: fetchDapContract: Dap Contract not found') {
      console.log('Unexpected error', e);
    }
  }
  return isRegistered;
};
module.exports = isSchemaRegistered;
