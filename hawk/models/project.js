module.exports = function () {
  let mongo = require('../modules/database');
  let collections = require('../config/collections');
  let Crypto = require('crypto');

  const NOTIFICATION_PREFERENCES_FIELD = 'notifies';
  const WEBHOOK_FIELDS ='Hook';

  /**
   * Generate sha256 hash from user id and project id
   *
   * @param {String} userId
   * @param {String} projectId
   * @returns {String} hash
   */
  let generateInviteHash = function (userId, projectId) {
    let string = userId + process.env.SALT + projectId;

    return Crypto.createHash('sha256').update(string, 'utf8').digest('hex');
  };


  /**
   * Get user projects by userId
   *
   * @param {String} userId
   * @returns {Promise.<TResult>}
   */
  let getByUser = function (userId) {
    let userCollection = collections.MEMBERSHIP + ':' + userId;

    return mongo.aggregation(userCollection, [
      {$lookup: {
        from: collections.PROJECTS,
        localField: 'project_id',
        foreignField: '_id',
        as: 'project'
      }},
      {$unwind: '$project'},
      {$project: {
        id: '$project_id',
        name: '$project.name',
        description: '$project.description',
        uri: '$project_uri',
        domain: '$project.domain',
        token: '$project.token',
      }}
    ])
      .then(function (projects) {
        let queries = [];

        for (let i = 0; i < projects.length; i++) {
          queries.push(
            getTeam(projects[i].id)
              .then(function (team) {
                projects[i].team = team;
              })
          );

          queries.push(
            getUserData(projects[i].id, userId)
              .then(function (userData) {
                projects[i].user = userData;
              })
          );
        }

        return Promise.all(queries)
          .then(function () {
            return projects.filter(function (project) {
              return !project.user.is_pending;
            });
          });
      });
  };

  /**
   * Add member to the project
   *
   * @param {String} projectId
   * @param {String} projectUri
   * @param {String} userId
   * @param {Boolean} isOwner (optional) if true, user will be added with admin access
   * @returns {Promise.<TResult>}
   */
  let addMember = function (projectId, projectUri, userId, isOwner=false) {
    let role = isOwner ? 'admin' : 'member',
        userCollection = collections.MEMBERSHIP + ':' + userId,
        projectCollection = collections.TEAM + ':' + projectId;

    let membershipParams = {
      project_id: mongo.ObjectId(projectId),
      notifies: {
        email: true,
        tg: false,
        slack: false
      }
    };

    let teamParams = {
      user_id: mongo.ObjectId(userId),
      role: role,
      is_pending: !isOwner
    };

    return mongo.findOne(projectCollection, {user_id: mongo.ObjectId(userId)})
      .then(function (result) {
        if (result) {
          throw Error('User is already in project');
        }
      })
      .then(function () {
        return getProjectUriByUser(userId, projectUri);
      })
      .then(function (uri) {
        membershipParams.project_uri = uri;

        return mongo.insertOne(userCollection, membershipParams);
      })
      .then(function () {
        return mongo.insertOne(projectCollection, teamParams);
      });
  };

  /**
   * Add new project to the database
   *
   * @param {String} data.name
   * @param {String} data.description
   * @param {String} data.domain
   * @param {Date} data.dt_added
   * @param {String} data.uid_added
   * @param {String} data.uri
   * @param {String} data.token
   *
   * @returns {Request|Promise.<TResult>}
   */
  let add = function (data) {
    return mongo.insertOne(collections.PROJECTS, data)
      .then(function (result) {
        let insertedProject = result.ops[0];

        return addMember(insertedProject._id, insertedProject.uri, insertedProject.uid_added, true)
          .then(function () {
            return insertedProject;
          });
      });
  };

  /**
   * Get project by project id. Also write project team to the team property
   *
   * @param {String} id
   * @returns {Promise.<TResult>}
   */
  let get = function (id) {
    let project;

    return mongo.findOne(collections.PROJECTS, {
      _id: mongo.ObjectId(id)
    })
      .then(function (project_) {
        project = project_;

        return getTeam(project._id);
      })
      .then(function (team) {
        project.team = team;
        return project;
      });
  };

  /**
   * Save project notifications for user with userId
   *
   * @param {String} projectId
   * @param {String} userId
   * @param {String} type - notification type (email|tg|slack)
   * @param {Boolean} value - enable or disable notifications (true|false)
   */
  let editNotifies = function (projectId, userId, type, value) {
    let userCollection = collections.MEMBERSHIP + ':' + userId,
        field = NOTIFICATION_PREFERENCES_FIELD + '.' + type;

    return mongo.updateOne(userCollection,
      {project_id: mongo.ObjectId(projectId)},
      {
        $set: {[field]: value}
      });
  };

  /**
   * Save webhook for project notofications for user with userId
   *
   * @param {String} projectId
   * @param {String} userId
   * @param {String} type - type of notifications (tg|slack)
   * @param {String} value - url for webhook
   */
  let saveWebhook = function (projectId, userId, type, value) {
    let userCollection = collections.MEMBERSHIP + ':' + userId,
        field = type+WEBHOOK_FIELDS;

    return mongo.updateOne(userCollection,
      {project_id: mongo.ObjectId(projectId)},
      {$set: {[field]: value}});
  };

  /**
   * Get project team by project id
   *
   * @param projectId
   * @returns {Promise.<TResult>}
   */
  let getTeam = function (projectId) {
    let projectCollection = collections.TEAM + ':' + projectId;

    return mongo.aggregation(projectCollection, [
      {$lookup: {
        from: collections.USERS,
        localField: 'user_id',
        foreignField: '_id',
        as: 'user'
      }},
      {$project: {
        id: '$user_id',
        role: 1,
        is_pending: 1,
        notifies: 1,
        tgHook: 1,
        slackHook: 1,
        email: '$user.email'
      }}
    ]);
  };

  /**
   * Set is_pending field to false for user with userId in project team collection
   *
   * @param {String} projectId
   * @param {String} userId
   */
  let confirmInvitation = function (projectId, userId) {
    let projectCollection = collections.TEAM + ':' + projectId;

    return mongo.updateOne(projectCollection, {user_id: mongo.ObjectId(userId)}, {$set: {is_pending: false}});
  };

  /**
   * Set user's role to admin
   *
   * @param {String} projectId
   * @param {String} userId
   * @returns {Promise.<TResult>|Request}
   */
  let grantAdminAccess = function (projectId, userId) {
    let projectCollection = collections.TEAM + ':' + projectId;

    return mongo.updateOne(projectCollection, {user_id: mongo.ObjectId(userId)}, {$set: {role: 'admin'}});
  };

  /**
   * Get user info in project with projectId
   *
   * @param {String} projectId
   * @param {String} userId
   */
  let getUserData = function (projectId, userId) {
    let userCollection = collections.MEMBERSHIP + ':' + userId,
        projectCollection = collections.TEAM + ':' + projectId;

    return mongo.findOne(projectCollection, {user_id: mongo.ObjectId(userId)})
      .then(function (userData) {
        return mongo.findOne(userCollection, {project_id: mongo.ObjectId(projectId)})
          .then(function (projectData) {
            userData.projectUri = projectData.project_uri;
            userData.userId = userId;
            userData.notifies = projectData.notifies;
            userData.tgHook = projectData.tgHook;
            userData.slackHook = projectData.slackHook;
            return userData;
          });
      });
  };

  /**
   * Get unique project uri for user with userId
   *
   * @param {String} userId
   * @param {String} uri
   * @returns {Request|Promise.<TResult>}
   */
  let getProjectUriByUser = function (userId, uri) {
    let userCollection = collections.MEMBERSHIP + ':' + userId,
        regexp = new RegExp('^' + uri + '(-[0-9]+)?$', 'i');

    return mongo.find(userCollection, {'project_uri': {$regex: regexp}})
      .then(function (result) {
        let index = result.length !== 0 ? '-' + result.length : '';

        return uri + index;
      });
  };

  let getByToken = function (token) {
    return mongo.findOne(collections.PROJECTS, {token: token});
  };

  return {
    add: add,
    get: get,
    getByUser: getByUser,
    getByToken: getByToken,
    addMember: addMember,
    editNotifies: editNotifies,
    saveWebhook: saveWebhook,
    getTeam: getTeam,
    generateInviteHash: generateInviteHash,
    confirmInvitation: confirmInvitation,
    grantAdminAccess: grantAdminAccess,
    getUserData: getUserData
  };
}();