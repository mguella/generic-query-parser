'use strict';

var parseValue = require('parse-value');

/**
 * Parse filters and operator into conditions
 * @param  {Object} values     filter values
 * @param  {Object} operators   filter operators
 * @param  {Object} types       filter types
 * @return {Object}             conditions
 */
exports.conditions = function conditions(values, operators, types){
    // if values not defined exit
    if (!values) return;

    // init conditions
    var conditions = {};

    // for each key in the filter values
    for (let key in values){
        // get filter operator and filter value
        let op = operators && operators[key],
            val = values[key];
        // if type is defined for the key
        if (types[key])
            // parse value with given type
            val = parseValue(types[key], val)
        // if exists and operator is not equal
        if (op && op !== 'eq')
            // assign operator and value to conditions key
            conditions[key] = { [op]: val }
        // otherwise if no operator
        else
            // assign value to conditions key
            conditions[key] = val;
    }

    // return conditions
    return conditions;
}

/**
 * Parse projection value
 * @param  {String} value [description]
 * @return {String}       projection
 */
exports.projection = function projection(value){
    // replace commas ',' with spaces ' '
    return (typeof value === 'string' ? value.replace(/\,/gm,' ') : value) || null;
}

/**
 * Parse sort value
 * @param  {String} value [description]
 * @return {String}       sort
 */
exports.sort = function sort(value){
    // replace commas ',' with spaces ' '
    return (typeof value === 'string' ? value.replace(/\,/gm,' ') : value) || undefined;
}

/**
 * Parse skip value
 * @param  {String} value [description]
 * @return {Number}       skip
 */
exports.skip = function skip(value){
    // parse value to int
    return parseInt(value) || 0;
}

/**
 * Parse limit value
 * @param  {String} value [description]
 * @return {Number}       limit
 */
exports.limit = function limit(value){
    // parse value to int
    return parseInt(value) || 0;
}

/**
 * Parse query
 * @param  {Object} query [description]
 * @return {Object}       [description]
 */
exports.parse = function parse(query){
    // return
    return {
        // conditions
        conditions: exports.conditions(query.filter, query.operator, query.type),
        // projection
        projection: exports.projection(query.fields),
        // options
        options: {
            sort: exports.sort(query.sort),
            skip: exports.skip(query.skip),
            limit: exports.limit(query.limit)
        }
    }
}
