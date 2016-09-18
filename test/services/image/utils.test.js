'use strict';

const assert = require('assert');
const app = require('../../../src/app');
const utils = require('../../../src/services/image/utils');

describe('image utils', function () {
  describe('#generateFileName', function () {
    it('it works', () => {
      const result = utils.generateFileName('image.jpg');

      assert.ok(result);
    });
  });
  describe('#getFileType', function () {
    it('it returns empty string for invalid file name', () => {
      const type = utils.getFileType('image.');

      assert.equal(type, '');
    });
    it('it returns empty string for invalid type', () => {
      const type = utils.getFileType({});

      assert.equal(type, '');
    });
    it('it returns empty string for invalid file name', () => {
      const type = utils.getFileType('image');

      assert.equal(type, '');
    });
    it('it returns file type of .png', () => {
      const type = utils.getFileType('image.png');

      assert.equal(type, '.png');
    });
    it('it returns file type of .PNG', () => {
      const type = utils.getFileType('image.PNG');

      assert.equal(type, '.PNG');
    });
    it('it returns file type of .jpeg', () => {
      const type = utils.getFileType('image.jpeg');

      assert.equal(type, '.jpeg');
    });
    it('it returns file type of .JPEG', () => {
      const type = utils.getFileType('image.JPEG');

      assert.equal(type, '.JPEG');
    });
    it('it returns file type of .jpg', () => {
      const type = utils.getFileType('image.jpg');

      assert.equal(type, '.jpg');
    });
    it('it returns file type of .JPG', () => {
      const type = utils.getFileType('image.JPG');

      assert.equal(type, '.JPG');
    });    
  });
});
