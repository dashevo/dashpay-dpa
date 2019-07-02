
/**
 * Profile needs some function from Wallet-lib, theses are passed to ProfileFacade via `this.parent`
 * We can use that to overwrite our Profile method.
 */


/* eslint-enable no-param-reassign */

class ProfileFacade {
  constructor(transporter, dpp, buserFacade, importedMethods) {
    if (transporter) {
      this.transporter = transporter;
    }
    this.buserFacade = buserFacade;
    this.importedMethods = importedMethods;
    this.dpp = dpp;
  }
}

ProfileFacade.prototype.create = require('./methods/create');
ProfileFacade.prototype.get = require('./methods/get');
ProfileFacade.prototype.getAll = require('./methods/getAll');
ProfileFacade.prototype.getByBUser = require('./methods/getByBUser');
ProfileFacade.prototype.getByBUsername = require('./methods/getByBUsername');
ProfileFacade.prototype.getByDisplayName = require('./methods/getByDisplayName');
ProfileFacade.prototype.getById = require('./methods/getById');
ProfileFacade.prototype.getByUserId = require('./methods/getByUserId');

module.exports = ProfileFacade;
