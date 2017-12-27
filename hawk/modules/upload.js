let request = require('request');
let fs = require('fs');

/**
 * Use Capella API for the image uploading
 *
 * {@link https://github.com/codex-team/capella}
 *
 * @param {String} imagePath local path to image
 * @param {Function} callback action after upload picture
 */
let uploadImageToCapella = function (imagePath, callback) {

  let req = request.post('https://capella.pics/upload', callback);

  let form = req.form();
  form.append('file', fs.createReadStream(imagePath));
};

module.exports = function () {
  return {
    uploadImageToCapella: uploadImageToCapella
  };
}();