[![Build Status](https://travis-ci.org/vitaminjs/query-builder.svg?branch=master)](https://travis-ci.org/vitaminjs/query-builder)

A fluent SQL query builder for Node.js
It provides support for:
- **MySQL** (v5.7+)
- **MSSQL** (2012+)
- **SQLite** (v3.15.0+)
- **PostgreSQL** (v9.5+)

## Installing

```bash
$ npm install --save vitamin-query
```

## Getting started

`vitamin-query` is composed of a set of useful expressions and helpers to build SQL queries easily

### building queries

```js
// import the query builder
import qb from 'vitamin-query'

// Select query
let query = qb.select('count(*)').from('employees').where('salary between ? and ?', 1500, 3000).build('pg')
assert.equal(query.sql, 'select * from employees where salary between $1 and $2')
assert.deepEqual(query.params, [ 1500, 3000 ])

// Insert query
let fred = { name: "Fred", score: 30 }
let query = qb.insert(fred).into('players').returning('*').build('mssql')
assert.equal(query.sql, 'insert into players (name, score) output inserted.* values (?, ?)')
assert.deepEqual(query.params, [ 'Fred', 30 ])

// Update query
let query = qb.update('books').set('status', 'archived').where('publish_date >= ?', 2000).build('mysql')
assert.equal(query.sql, 'update books set status = ? where publish_date >= ?')
assert.deepEqual(query.params, [ 'archived', 2000 ])

// Delete query
let query = qb.deleteFrom('accounts').where({ activated: false, deleted: true }).build('sqlite')
assert.equal(query.sql, 'delete from accounts where activated = ? and deleted = ?')
assert.deepEqual(query.params, [ false, true ])
```

### Custom compiler

If you may use a custom query compiler instead of the built-in ones, you can pass its instance to `build()`

```js
// in path/to/maria-compiler.js
import MysqlCompiler from 'vitamin-query/compiler/mysql'

class MariaCompiler extends MysqlCompiler { ... }

// later, you can use its instance with any query instance
import qb from 'vitamin-query'

let query = qb.selectFrom('table').build(new MariaCompiler({ /* options */ }))
```

## API

For examples of usage, please refer to the tests

### Builder

The default export of `vitamin-query` is a plain object with the following methods:

- **select**(...columns: Array<string | Expression>): Select
- **selectFrom**(table: string | Expression): Select
- **insert**(data: object): InsertStatement
- **insertInto**(table: string | Expression): InsertStatement
- **update**(table: string | Expression): UpdateStatement
- **deleteFrom**(table: string | Expression): DeleteStatement

### Expression helpers

These Helpers are functions that return Expression instances:

- **raw**(expr: string, ...params): LiteralExpression
- **id**(name: string): IdentifierExpression
- **alias**(expr: any, name: string; ...columns: Array< string >): AliasExpression
- **func**(name: string, ...args: Array< any >): FunctionExpression
- **asc**(name: string | Expression): OrderExpression
- **desc**(value: string | Expression): OrderExpression
- **table**(value: string | Expression): TableExpression
- **cast**(value: any, type: string): LiteralExpression
- **esc**(value: string): LiteralExpression
- **val**(value: any): LiteralExpression

### Function helpers

Helpers to emulate the SQL built-in functions

- **upper | ucase**(expr: string | Expression): FunctionExpression
- **lower | lcase**(expr: string | Expression): FunctionExpression
- **replace**(): FunctionExpression
- **substr | substring**(): FunctionExpression
- **concat**(): FunctionExpression
- **len | length**(): FunctionExpression
- **repeat**(): FunctionExpression
- **space**(): FunctionExpression
- **strpos | position**(): FunctionExpression
- **left**(): FunctionExpression
- **right**(): FunctionExpression
- **trim**(): FunctionExpression
- **ltrim**(): FunctionExpression
- **rtrim**(): FunctionExpression
- **abs**(): FunctionExpression
- **round**(): FunctionExpression
- **rand | random**(): FunctionExpression
- **now || datetime**(): FunctionExpression
- **utc**(): FunctionExpression
- **today | curdate**(): FunctionExpression
- **clock | curtime**(): FunctionExpression
- **date**(): FunctionExpression
- **time**(): FunctionExpression
- **day**(): FunctionExpression
- **month**(): FunctionExpression
- **year**(): FunctionExpression
- **hour**(): FunctionExpression
- **minute**(): FunctionExpression
- **second**(): FunctionExpression

## Testing

```bash
$ npm test
```

## Change log

- **v0.2.1** - _Add support for common table expressions_
  - Deprecate `Query::toSQL()` and add `Query::build()` instead
  - Add Support for named parameters within `raw` helper (issue #6)
  - Add Support for common table expressions using `Query::with()`
  - Minor fixes

- **v0.2.0** - _API breaking changes_
  - Remove the operator argument from `Criteria.where()` (issue #4)
  - Lowcase all the helper functions
  - Use class mixin to keep the code DRY
  - Fix minor bugs and typos

- **v0.1.2** - _Add new datetime helpers_

- **v0.1.1** - _Add helpers for SQL functions_
  - Configure Travis CI
  - Update README.md
  - Add helpers for SQL functions
  - Fix minor bugs
  
- **v0.1.0** - _Intial release_
