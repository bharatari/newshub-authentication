const _ = require('lodash');

module.exports = {
  includeOrganizationUser(user) {
    const currentOrganizationId = user.currentOrganizationId;

    const currentOrganization = _.find(user.organizations, (n) => {
      return n.id === currentOrganizationId;
    });

    if (currentOrganization) {
      user.organization_users = currentOrganization.organization_users;
    }
    
    return user;
  },
  includeOrganizationUserBatch(users) {
    if (users) {
      for (let i = 0; i < users.length; i++) {
        users[i] = this.includeOrganizationUser(users[i]);
      }
    }

    return users;
  },
}
