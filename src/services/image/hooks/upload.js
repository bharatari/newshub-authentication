'use strict';

const utils = require('../utils');

module.exports = function (options) {
  return function (hook) {
    return new Promise((resolve, reject) => {
      // TODO Validate file type and ensure only single file
      utils.protect(() => {
        hook.params.file('file').upload({
          adapter: require('skipper-s3'),
          key: hook.app.get('keys').S3_API_KEY,
          secret: hook.app.get('keys').S3_API_SECRET,
          bucket: 'sitrea-newshub',
          maxBytes: 5000000,
          saveAs(fs, cb) {
            const finalPath = `/utdtv-images/${utils.generateFileName(fs.filename)}`;
            cb(null, finalPath);
          },
        }, (err, uploadedFiles) => {
          hook.params.err = err;
          hook.params.uploadedFiles = uploadedFiles;
          resolve();
        });
      }, (err) => {
        hook.params.err = err;
        hook.params.uploadedFiles = [];
        resolve();
      });
    });
  };
};
