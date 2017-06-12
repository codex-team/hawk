var config = require('../config/mongo');
var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;

var mongo = (function () {

  var connection = mongoClient.connect(config.mongodb.connection);

  var getCollection = function (c) {
    return connection.then(function(db) { return db.collection(c)});
  };

  var insertOne = function (c, object) {
    return getCollection(c)
      .then(function (collection) {
        return collection.insertOne(object);
      })
  };

  var findOne = function (c, object) {
    return getCollection(c)
      .then(function (collection) {
        return collection.findOne(object);
      })
  };

  var find = function (c, query, sort) {
    return getCollection(c)
      .then(function (collection) {
        let cursor = collection.find(query);
        if (sort) {
          cursor = cursor.sort(sort);
        }
        return cursor.toArray();
      })
  };

  var updateOne = function (c, query, update) {
    return getCollection(c)
      .then(function (collection) {
        return collection.updateOne(query, update);
      })
  };

  /**
   * See https://docs.mongodb.com/manual/aggregation/
   * Use aggregation for custom queries
   *
   * @param c - collection name
   * @param query - array of aggregation commands (see https://docs.mongodb.com/manual/reference/operator/aggregation/interface/)
   * @returns {Promise.<TResult>}
   */
  var aggregation = function (c, query) {
    return getCollection(c)
      .then(function (collection) {
        return collection.aggregate(query).toArray();
      });
  };

  return {
    findOne : findOne,
    insertOne : insertOne,
    find: find,
    ObjectId: mongodb.ObjectId,
    aggregation: aggregation,
    updateOne: updateOne
  }

})();

module.exports = mongo;
