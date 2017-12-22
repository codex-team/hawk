let request = require('request');
let fs = require('fs');

/**
 * Use capella API for the image uploading
 *
 * @param {String} imagePath
 * @param callback
 *
 */
let uploadImageToCapella = function (imagePath, callback) {

  let req = request.post("https://capella.pics/upload", callback);

  let form = req.form();
  form.append('file', fs.createReadStream(imagePath));
}

module.exports.uploadImageToCapella = uploadImageToCapella;