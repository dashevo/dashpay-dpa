// const { is } = require('../../utils');

module.exports = async function get(identifier) {
  if (!identifier) throw new Error('Expected valid identifier to be a profileID');
  if (!this.transporter) throw new Error('Transporter expected to get a profile');
  throw new Error('Unsupported');

  // if (is.profileid(identifier)) return this.getById(identifier);
  // return this.getByDisplayName(identifier);
};
