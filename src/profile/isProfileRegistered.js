const isProfileRegistered = async function () {
  const isRegistered = false;
  console.log('Schema', this.dapId)
  try {
    const dapUsers = await this.transport.transport.fetchDapObjects(this.dapId, 'profile', {});
    console.log(dapUsers);
    console.log('isRegistered', isRegistered);
  } catch (e) {
    if (e.message !== 'DAPI RPC error: fetchDapContract: Error: DAPI RPC error: fetchDapContract: Dap Contract not found') {
      console.log('Unexpected error', e);
    }
  }
  return isRegistered;
};
module.exports = isProfileRegistered;
