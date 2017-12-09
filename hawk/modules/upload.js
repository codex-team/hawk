let request = require('request');
let fs = require('fs')

/**
 * Use capella API for image download
 *
 * @param imagePath
 * @param callback
 *
 */
let uploadImageCapella = function (imagePath, callback) {

  let req = request.post("https://capella.pics/upload",callback);
  let form = req.form();
  form.append('file', fs.createReadStream(imagePath));
}

module.exports.uploadImage = uploadImageCapella;