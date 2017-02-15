const mockery = require('mockery');
const sendgrid = require('./mocks/sendgrid');

mockery.enable({
  warnOnUnregistered: false,
});

mockery.registerMock('sendgrid', sendgrid);
