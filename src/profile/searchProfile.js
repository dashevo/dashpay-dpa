module.exports = async function searchProfile(pattern) {
  const search = {
    totalCount: 0,
    results: [],
  };
  const profiles = (await this.transport.transport.fetchDapObjects(this.dapId, 'profile', {}));
  profiles.forEach((profile) => {
    if (profile.bUserName === pattern) {
      search.results.push(profile);
      search.totalCount += 1;
    }
  });
  return search;
};
