module.exports = (function () {

	var port = 3000;

  var mongodb = (function () {

    var url = "mongodb://localhost:27017",
        dbname = "db_name";

		connection = url + "/" + dbname;

		return {
			connection: connection
		}

	})();

	return {
		port: port,
		mongodb: mongodb
	}

  // "session": {
  //   "secret": "secret_key",
  //   "key": "cid",
  //   "cookie": {
  //     "path": "/",
  //     "httpOnly": true,
  //     "maxAge": null
  //   }
  // }

})();
