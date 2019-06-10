module.exports = async function searchProfile(searchString = '', fieldName = 'bUserName') {
  const trimmedSearchString = searchString.trim();
  if (trimmedSearchString === '') {
    return [];
  }
  const options = {
    where: {
      [`data.${fieldName}`]: {
        $regex: trimmedSearchString,
        $options: 'i',
      },
    },
  };
  const profiles = await this.transport.transport.fetchDocuments(this.dpp.getContract().getId(), 'profile', options);
  return profiles;
};
