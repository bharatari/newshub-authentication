const _ = require('_');

module.exports = {
  includeOrganizationUser(user) {
    const currentOrganizationId = user.currentOrganizationId;

    const currentOrganization = _.find(user.organizations, (n) => {
      return n.id === currentOrganizationId;
    });
  },
  includeOrganizationUserBatch(users) {

  },
}
