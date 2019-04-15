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
  const profiles = await this.transport.transport.fetchDapObjects(this.dapId, 'profile', options);
  return profiles;
};
