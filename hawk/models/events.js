module.exports = (function() {

  let mongo = require('../modules/database');

  let add = function(collection, events) {

    mongo.insertOne(collection, events)
      .then(function(){
        return true;
      }).catch(function(){
        return false;
      });
  };

  return {
    add: add,
  };

})();
