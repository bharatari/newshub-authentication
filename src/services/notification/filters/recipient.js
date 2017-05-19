'use strict';

const errors = require('feathers-errors');

module.exports = function (data, connection, hook) {
  const sender = hook.params.user.id;
  const user = connection.user.id;
  const recipient = data.recipientId;

  if (user !== recipient) {
    return false;
  }

  return data;
};
