const DashPlatformProtocol = require('@dashevo/dpp');
const DashPaySchema = require('../schema/dashpay.schema.json');

function getValidContract(dpp, dapName, dapSchema) {
  const contract = dpp.contract.create(dapName, dapSchema);

  if (!dpp.contract.validate(contract)
    .isValid()) {
    throw new Error('Invalid DashPayDPA contract');
  }
  return contract;
}
module.exports = function setDPP() {
  this.dpp = new DashPlatformProtocol();
  const contract = getValidContract(this.dpp, 'DashPayNativePreDemo1', Object.assign({}, DashPaySchema));
  this.dpp.setContract(contract);
};
