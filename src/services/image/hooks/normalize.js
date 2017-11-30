const errors = require('@feathersjs/errors');

module.exports = function (options) {
  return function (hook) {
    const err = hook.params.err;
    const uploadedFiles = hook.params.uploadedFiles;

    if (err || !uploadedFiles) {
      throw new errors.BadRequest(err || 'Something went wrong with uploading your file.');
    } else if (uploadedFiles[0]) {
      hook.data.cdn = 'https://s3-us-west-2.amazonaws.com/sitrea-newshub';
      hook.data.fileName = uploadedFiles[0].fd;
    } else {
      throw new errors.BadRequest('Something went wrong with uploading your file.');
    }

    return hook;
  };
};
