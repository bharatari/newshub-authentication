// Write functions that can take a Sequelize schema and convert it

/**
 * The display property allows you to set whether a property should be visible by default on a table.
 * If you don't want a property to appear at all on the client, remove it from the fields array and
 * sanitize it on the server-side. The display property does not supersede permissions. 
 * Fields will still only be displayed if the user has the permission to do so.
 * 
 * The same goes for the editable flag. It governs whether someone, given the proper permissions, should
 * be able to edit a property. Some properties such as IDs should not be directly edited.
 */
module.exports = {
  getSchema(model) {
    return this[model];
  },
  device: {
    fields: [{
      label: 'Name',
      property: 'user.fullName',
      computed: true,
      association: true,
      editable: false,
      display: true,
      type: 'string',
    }, {
      label: 'First Name',
      property: 'user.firstName',
      association: true,
      editable: true,
      display: false,
      type: 'string',
    }, {
      label: 'Last Name',
      property: 'user.lastName',
      association: true,
      editable: true,
      display: false,
      type: 'string',
    }, {
      label: 'Purpose',
      property: 'purpose',
      editable: true,
      display: true,
      type: 'string',
    }, {
      label: 'Notes',
      property: 'notes',
      editable: true,
      display: true,
      type: 'string',
    }, {
      label: 'Special Requests',
      property: 'specialRequests',
      editable: true,
      display: true,
      type: 'string',
    }, {
      label: 'Admin Notes',
      property: 'adminNotes',
      editable: true,
      display: true,
      type: 'string',
    }, {
      label: 'Start Date',
      property: 'startDate',
      editable: true,
      display: true,
      type: 'datetime',
    }, {
      label: 'End Date',
      property: 'endDate',
      editable: true,
      display: true,
      type: 'datetime',
    }, {
      label: 'Meta',
      property: 'meta',
      editable: true,
      display: false,
      type: 'json',
    }, {
      label: 'Approved',
      property: 'approved',
      editable: true,
      display: false,
      type: 'boolean',
    }, {
      label: 'Checked Out',
      property: 'checkedOut',
      editable: true,
      display: false,
      type: 'boolean',
    }, {
      label: 'Checked In',
      property: 'checkedIn',
      editable: true,
      display: false,
      type: 'boolean',
    }, {
      label: 'Disabled',
      property: 'disabled',
      editable: true,
      display: false,
      type: 'boolean',
    }, {
      label: 'Status',
      property: 'approved',
      computed: true,
      editable: false,
      display: true,
      type: 'string',
    }, {
      label: 'Approved By',
      property: 'approvedBy',
      editable: false,
      association: true,
      display: true,
      type: 'string',
    }]
  },
};