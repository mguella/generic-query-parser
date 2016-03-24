var Parser = require('./libs/parser');

/**
 * Parse query
 * @param  {Object} query [description]
 * @return {Object}       [description]
 */
exports.parse = Parser.parse;

/**
 * Parse query middleware
 * @param  {Object}   req  [description]
 * @param  {Object}   res  [description]
 * @param  {Function} next [description]
 */
exports.expressMiddleware = function parseMiddleware(req, res, next){
    req.custom = Parser.parse(req.query);
    next();
}

/**
 * Parse query middleware
 * @param  {Object}   req  [description]
 * @param  {Object}   res  [description]
 * @param  {Function} next [description]
 */
exports.koaMiddleware = function* parseMiddleware(next){
    this.custom = Parser.parse(this.query);
    yield next();
}
