# Generic Query Parser

Convert a query string object to a generic db query.

Generates conditions, projection, and options (sort, skip, limit).

Works for generic usage or even better in combination with an ORM.
You can map REST APIs to *mongodb driver*, *mongoose* or *sequelize* queries.
*Express* and *Koa* middlewares are already provided.


## Installation

```
npm install --save generic-query-parser
```

## Usage

You can manually parse a query string or use one of the middlewares already provided to easily consume the parsed object in your server code.

### Manual parse

```javascript
// define your query
var query = `
    filter[age]=32
    &operator[age]=gte
    &type[age]=number
    &filter[name]=^A.*
    &type[name]=regexp
    &limit=3
    &skip=0
`;

// require query string module (nested structures support)
var qs = require('qs');

// parse query to a nested object object
var requestQuery = qs.parse(query);

// require generic query parser
var Parser = require('generic-query-parser');

// parse request query to a db query
var dbQuery = Parser.parse(requestQuery)

// use parsed object
dbQuery.conditions;
dbQuery.projection;
dbQuery.options;
```

### Middleware

#### Express

Simply use `expressMiddleware` provided with the module and `req.custom` in each subsequent middleware will be populated with conditions, projection and options.

```javascript
// create new express app
var express = require('express'),
    app = express();

// require generic query parser
var Parser = require('generic-query-parser');

// use middleware
app.use(Parser.expressMiddleware);

// consume parsed results
app.use(function(req,res,next){
    var dbQuery = req.custom;

    dbQuery.conditions;
    dbQuery.projection;
    dbQuery.options;
})
```

#### Koa

Simply use `koaMiddleware` provided with the module and `this.custom` in each subsequent middleware will be populated with conditions, projection and options.

NOTE: Koa native query string module doesn't support nested structures. You need to use `koa-qs` module in order to use filter conditions.

```javascript
// create new koa app
var koa = require('koa'),
    app = koa();

// use koa-qs module to parse query string to nested object
require('koa-qs')(app)

// require generic query parser
var Parser = require('generic-query-parser');

// use middleware
app.use(Parser.koaMiddleware);

// consume parsed results
app.use(function*(next){
    var dbQuery = this.custom;

    dbQuery.conditions;
    dbQuery.projection;
    dbQuery.options;
})
```

### Documentation

#### Methods

**parse(queryObject)**

*Parse a query string object to a db query*

params

- Object `queryObject`: *query string object*

return

- Object: *parsed query composed by: conditions, projection, options*


**expressMiddleware(req, res, next)**

*Use as a middleware for Express*


**koaMiddleware(next)**

*Use as a middleware for Koa*


#### Syntax

##### Filters

Convert filter, operator and type from query to conditions object

Example:
```javascript
// age greather than or equal to 32 (converted to a number)
'filter[age]=32&operation[age]=gte&type[age]=number'
```

###### Filter values

Filter attributes by given value. Adds a condition for each attribute name received.

- Object `filter`: *filter values*
- String `filter[attribute]`: *value to filter for given attribute*

Example:
```javascript
// age 32
'filter[age]=32'

// color red
'filter[color]=red'

// name starts with 'A'
'filter[name]=^A.*'
```

###### Filter operators

Apply an operator to a filter value. Adds the given operator to the conditions.

- Object `operator`: *filter operators*
- String `operator[attribute]`: *filter operator for the attribute, one of* `eq`, `gt`, `gte`, `lt`, `lte` *or* `ne`

Example:
```javascript
// age greather or equal than
'operation[age]=gte'
```

###### Filter types

Apply an type to a filter value. Converts the value to the given type.

Some ORMs (or DBs) might do an implicit conversion and directly accept a string as parameter even if the db type is different. If this is not your case just use the `type` parameter.

- Object `type`: *filter types*
- String `type[attribute]`: *filter type for attribute, one of* `string`, `number`, `date`, `bool`, `regexp` *or* `null`

Example:
```javascript
// given age value is a number
'type[age]=number'

// given name value is a regex
'type[name]=regex'
```


##### Projection

- String `fields`: *list of desired fields in the projection, comma or space separated*


##### Sort

- String `sort`: *list of sorting attributes, comma or space separated*


##### Range

- Number `limit`: *results amount, default `0`*
- Number `skip`: *results offset, default `0`*

Example:
```javascript
// get the first 10
'skip=0&limit=10'

// get the next 10
'skip=10&limit=10'
```



*LICENSE: MIT*
