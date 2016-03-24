var parseValue = require('parse-value');

var Parser = {};

/**
 * Parse filters and operator into conditions
 * @param  {Object} values     filter values
 * @param  {Object} operators   filter operators
 * @param  {Object} types       filter types
 * @return {Object}             conditions
 */
Parser.conditions = function conditions(values, operators, types){
    // if values not defined exit
    if (!values) return;

    // init conditions
    var conditions = {};

    // for each key in the filter values
    for (var key in values){
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
Parser.projection = function projection(value){
    // replace commas ',' with spaces ' '
    return (typeof value === 'string' ? value.replace(/\,/gm,' ') : value) || null;
}

/**
 * Parse sort value
 * @param  {String} value [description]
 * @return {String}       sort
 */
Parser.sort = function sort(value){
    // replace commas ',' with spaces ' '
    return (typeof value === 'string' ? value.replace(/\,/gm,' ') : value) || undefined;
}

/**
 * Parse skip value
 * @param  {String} value [description]
 * @return {Number}       skip
 */
Parser.skip = function skip(value){
    // parse value to int
    return parseInt(value) || 0;
}

/**
 * Parse limit value
 * @param  {String} value [description]
 * @return {Number}       limit
 */
Parser.limit = function limit(value){
    // parse value to int
    return parseInt(value) || 0;
}

/**
 * Parse query
 * @param  {Object} query [description]
 * @return {Object}       [description]
 */
Parser.parse = function parse(query){
    // return
    return {
        // conditions
        conditions: Parser.conditions(query.filter, query.operator, query.type),
        // projection
        projection: Parser.projection(query.fields),
        // options
        options: {
            sort: Parser.sort(query.sort),
            skip: Parser.skip(query.skip),
            limit: Parser.limit(query.limit)
        }
    }
}

module.export = Parser;
