module.exports = async function getContacts() {
  if (this.buser === null) {
    throw new Error('BUser not registered. Can\'t send contact request');
  }
  const dapObjects = await this.transport.transport.fetchDapObjects(this.dapId, 'contact', {});

  const contacts = {};

  const { uname } = this.buser;

  const ensureContact = (contact) => {
    const relationUname = (contact.from === uname) ? contact.relation : contact.from;

    if (!contacts[relationUname]) {
      contacts[relationUname] = {
        accepted: false,
      };
    }
  };
  dapObjects.forEach((contact) => {
    if (contact.relation === uname || contact.from === uname) {
      ensureContact(contact);
      const relationUname = (contact.from === uname) ? contact.relation : contact.from;
      switch (contact.action) {
        case 'request':
          contacts[relationUname].requester = contact.from;
          if (relationUname === contact.from) contacts[relationUname].hdPublicKey = contact.content;
          break;
        case 'accept':
          contacts[relationUname].accepted = true;
          if (relationUname === contact.from) contacts[relationUname].hdPublicKey = contact.content;

          console.log('accept');
          break;
        default:
          console.log('Unexpected default', contact.action);
          break;
      }
    }
    // contacts[contact.from] = {accepted:false};
    // if (contact.action === 'accept') contacts[contact.from].accepted = true;
    // } else if (contact.from === uname) {
    //   if(!contacts[contact.relation])
    //   contacts[contact.relation] = {accepted:false};
    //   if (contact.action === 'accept') contacts[contact.relation].accepted = true;
    // }
  });
  // const relevants = dapObjects.filter(contact => (contact.relation) === this.buser.uname || (contact.from === this.buser.uname));


  return contacts;
};
