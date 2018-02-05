let Capella = require('@codexteam/capella-pics');

/**
 * Use Capella API for the image uploading
 *
 * {@link https://github.com/codex-team/capella}
 *
 * @param {String} imagePath local path to image
 * @param {Function} callback action after upload picture
 */
let uploadImageToCapella = function (imagePath, callback) {
  let capella = new Capella();

  capella.uploadFile(imagePath, function (resp) {
    callback(resp);
  });
};

module.exports = function () {
  return {
    uploadImageToCapella: uploadImageToCapella
  };
}();