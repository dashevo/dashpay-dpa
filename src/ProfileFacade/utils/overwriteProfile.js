/* eslint-disable no-param-reassign */
module.exports = async function overwriteProfile(self, profile) {
  const {
    prepareStateTransition,
    broadcastTransition,
    sendRawTransition,
  } = self.importedMethods;

  const { transporter, getByUserId } = self;

  // eslint-disable-next-line max-len
  profile.prepareStateTransition = (...args) => prepareStateTransition.call({ transporter }, ...args);
  profile.broadcastTransition = (...args) => broadcastTransition.call({ transporter }, ...args);
  profile.getByUserId = (...args) => getByUserId.call(self, ...args);
  profile.sendRawTransition = sendRawTransition;
  if (profile && profile.$meta.userId) {
    profile.setOwner(await self.buserFacade.getById(profile.$meta.userId));
  }
  return profile;
};
