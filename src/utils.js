const DashPlatformProtocol = require('@dashevo/dpp');
const DashPaySchema = require('./schema/dashpay.schema.json');

const createNewDPP = () => {
  function getValidContract(dpp, dapName, dapSchema) {
    const contract = dpp.contract.create(dapName, dapSchema);

    if (!dpp.contract.validate(contract)
      .isValid()) {
      throw new Error('Invalid DashPayDPA contract');
    }
    return contract;
  }
  const dpp = new DashPlatformProtocol();
  const contract = getValidContract(
    dpp,
    'DashPayNativePreDemo1',
    Object.assign({}, DashPaySchema),
  );

  dpp.setContract(contract);
  return dpp;
};


const is = {
  userid: uid => /^[a-f0-9]{64}$/i.test(uid),
  profileid: uid => /^[a-f0-9]{64}$/i.test(uid),
};
is.regid = is.userid;

module.exports = {
  is,
  createNewDPP,
};
