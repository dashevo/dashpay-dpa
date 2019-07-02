// eslint-disable-next-line no-unused-vars
module.exports = async function acceptContactRequest(contactRequest) {
  // Accepting is basically sending a contact request
  const acceptanceContactRequest = this.create({
    sender: contactRequest.receiver,
    receiver: contactRequest.sender,
  });

  return acceptanceContactRequest.send();
};
