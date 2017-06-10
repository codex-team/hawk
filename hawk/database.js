var config = require('./config');
var mongoClient = require("mongodb").MongoClient;

var mongo = (function () {

  var connection = mongoClient.connect(config.mongodb.connection);
  var collection = null;

  var getCollection = function (c) {
    return connection.then(function(db) {collection = db.collection(c)});
  };

  var insertOne = function (c, object) {
    return getCollection(c)
      .then(function () {
        return collection.insertOne(object);
      })
  };

  var findOne = function (c, object) {
    return getCollection(c)
      .then(function () {
        return collection.findOne(object);
      })
  };

  return {
    findOne : findOne,
    insertOne : insertOne
  }

})();

module.exports = mongo;
