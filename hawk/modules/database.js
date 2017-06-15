let config = require('../config/mongo');
let mongodb = require('mongodb');
let mongoClient = mongodb.MongoClient;

let mongo = (function () {

  let connection = mongoClient.connect(config.mongodb.connection);

  let getCollection = function (c) {
    return connection.then(function(db) { return db.collection(c)});
  };

  let insertOne = function (c, object) {
    return getCollection(c)
      .then(function (collection) {
        return collection.insertOne(object);
      })
  };

  let findOne = function (c, object) {
    return getCollection(c)
      .then(function (collection) {
        return collection.findOne(object);
      })
  };

  let find = function (c, query, sort) {
    return getCollection(c)
      .then(function (collection) {
        let cursor = collection.find(query);
        if (sort) {
          cursor = cursor.sort(sort);
        }
        return cursor.toArray();
      })
  };

  let updateOne = function (c, query, update) {
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
  let aggregation = function (c, query) {
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
