const isProfileRegistered = async function (props) {
  let isRegistered = false;
  console.log('Schema', this.dapId);
  try {
    const dapUsers = await this.transport.transport.fetchDapObjects(this.dapId, 'profile', {});
    // For now we based on displayName, later
    // We should have a 'busername field in profile to help us here
    const found = !!dapUsers.filter(el => el.displayName === props.displayName).length;
    if (found) isRegistered = true;
  } catch (e) {
    if (e.message !== 'DAPI RPC error: fetchDapContract: Error: DAPI RPC error: fetchDapContract: Dap Contract not found') {
      console.log('Unexpected error', e);
    }
  }
  return isRegistered;
};
module.exports = isProfileRegistered;
