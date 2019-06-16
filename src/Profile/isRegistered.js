
module.exports = async function isProfileRegistered(props) {
  let isRegistered = false;
  try {
    const dapUsers = await this.transport.transport.fetchDocuments(this.dpp.getContract().getId(), 'profile', {});
    // For now we based on displayName, later
    // We should have a 'busername field in profile to help us here
    const found = !!dapUsers.filter(el => el.displayName === props.displayName).length;
    if (found) isRegistered = true;
  } catch (e) {
    if (e.message !== 'DAPI RPC error: fetchContract: Error: DAPI RPC error: fetchContract: Dap Contract not found') {
      console.log('Unexpected error', e);
    }
  }
  return isRegistered;
};
