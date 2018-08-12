'use strict';

module.exports = function (options) {
  return function (hook) {
    if (hook.method === 'create') {
      hook.result = JSON.parse(JSON.stringify(hook.result));

      delete hook.result.token;
      delete hook.result.userId;
      delete hook.result.expires;
      delete hook.result.id;
    }

    if (hook.method === 'patch') {
      hook.result = {
        used: true,
      };
    }

    return hook;
  };
};
