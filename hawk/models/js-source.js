const mongo = require('../modules/database');
const collections = require('../config/collections');
const rp = require('request-promise');

/**
 * Module that represents JS source file associated with source-map
 * Items stores in collection 'js-sources:<projectId>'
 */
/**
 * @typedef {object} JSSourceItem
 * @property {string} url
 * @property {string} sourceMapURL
 * @property {string} revision
 * @property {string} sourceBody - full script text
 * @property {string} sourceMapBody - source-map file content
 */
module.exports = class JSSource {

  /**
   * @constructor
   * @param {string} projectId
   * @param {string} url
   * @param {string} revision
   */
  constructor({projectId, url, revision}){
    this.data = {projectId, url, revision};
  }

  /**
   * Return storage collection name
   * @return {string}
   */
  get collectionName(){
    return collections.JS_SOURCE.replace('<projectId>', this.projectId);
  }

  /**
   * Fills the model
   * @param {object} fillingData
   */
  set data(fillingData){
    this.projectId = fillingData.projectId || this.projectId || null;
    this.url = fillingData.url || this.url || null;
    this.revision = fillingData.revision || this.revision || null;
    this.sourceMapURL = fillingData.sourceMapURL || this.sourceMapURL || null;
    this.sourceBody = fillingData.sourceBody || this.sourceBody || null;
    this.sourceMapBody = fillingData.sourceMapBody || this.sourceMapBody || null;
  }

  /**
   * Return model data
   * @return {JSSourceItem}
   */
  get data(){
    let fields = ['projectId', 'url', 'revision', 'sourceMapBody', 'sourceMapURL'];
    let output = {};

    fields.forEach(item => {
      output[item] = this[item];
    });

    return output;
  }

  /**
   * Find downloaded source info
   * @return {Promise<JSSourceItem|undefined>}
   */
  async find(){
    let foundItems = await mongo.find(this.collectionName, {
      url: this.url,
      revision: this.revision,
    }, null, 1);

    return foundItems.pop();
  }

  /**
   * Saves JS source information to the DB
   * @return {Promise<*>}
   */
  async save(){
    return mongo.insertOne(this.collectionName, this.data);
  }

  /**
   * Load source
   * Download from external URL or get from DB if it was previously downloaded
   * @return {Promise<JSSource>}
   */
  async load(){
    let alreadyDownloaded = await this.find();

    if (alreadyDownloaded) {
      this.data = alreadyDownloaded;
      logger.log('Source already was downloaded: %s ', this.data.url);
      return this.data;
    }

    try {
      let source = await this.download(this.url);

      this.data = {
        sourceBody: source
      };

      let sourceMappingURL = this.getSourceMapURL();

      logger.log('Source map URL found: %s', sourceMappingURL);

      if (!sourceMappingURL) {
        return this.data;
      }

      this.data = {
        sourceMapURL : sourceMappingURL
      };

      let sourceMap = await this.download(this.sourceMapURL);

      logger.log('Source Map Downloaded: %s', Math.round(sourceMap.length / 1000) + 'k chars');

      if (sourceMap) {
        this.sourceMapBody = sourceMap;
      }

      let savingResponse = await this.save();

      if (savingResponse.insertedId) {
        logger.log('Source saved');
      } else {
        logger.log('Source was not saved');
      }
    } catch (error)  {
      logger.error('JS Source downloading error:', error);
    }

    return this.data;
  }

  /**
   * Download Source File
   * @param {string} sourceURL - endpoint
   * @return {Promise<string>}
   */
  async download(sourceURL){
    logger.info('Downloading...    ', sourceURL);
    return rp({
      uri: sourceURL,
      headers: {
        'User-Agent': "Hawk, your errors tracker system <('o'<)"
      }
    }).then((response) => {
      return response;
    });
  }

  /**
   * Extract last link to the source map from source file
   * @return {string|null} - full URL
   */
  getSourceMapURL(){
    if (!this.sourceBody || this.sourceBody.indexOf('//# sourceMappingURL') === -1) {
      return null;
    }

    let sourceMappingValue = this.sourceBody.match(/\/\/# sourceMappingURL=(\S+)/);

    if (!sourceMappingValue){
      return null;
    }

    let map = sourceMappingValue[1];

    /**
     * Relative path to map
     */
    if (map.substring(0,3) !== 'http') {

      /**
       * From source URL
       * http://v.dtf.osnova.io/static/build/v.dtf.osnova.io/all.min.js?1527864690
       * get source map URL
       * http://v.dtf.osnova.io/static/build/v.dtf.osnova.io/all.min.js.map
       */
      let staticURL = this.url.match(/(https?:\/\/)\S+\//);
      return staticURL[0] + map;

    /**
     * Absolute path to map
     */
    } else {
      return map;
    }
  }
}