[![Build Status](https://travis-ci.org/vitaminjs/query-builder.svg?branch=master)](https://travis-ci.org/vitaminjs/query-builder)

A fluent SQL query builder for Node.
It provides support for:
- **SQLite** (v3.15.0+)
- **MySQL** (v5.7+)
- **PostgreSQL** (v9.5+)
- **MSSQL** (2012+)

## Installing

```bash
$ npm install --save vitamin-query
```

## Getting started

`vitamin-query` is composed of a set of useful functions to build SQL queries easily

### building queries

```js
// import the query builder
import { select, insert, update, deleteFrom, raw, not, lt, table, column } from 'vitamin-query'


let selectQuery = select().from('employees').where(raw('salary > ?', 1500)).build('pg')
assert.equal(selectQuery.sql, 'select * from employees where salary > $1')
assert.deepEqual(selectQuery.params, [ 1500 ])


let fred = { name: "Fred", score: 30 }
let insertQuery = insert(fred).into('players').returning('*').build('mssql')
assert.equal(insertQuery.sql, 'insert into players (name, score) output inserted.* values (?, ?)')
assert.deepEqual(insertQuery.params, [ 'Fred', 30 ])


let updateQuery = update('books').set('status', 'archived').where({ publish_date: not(lt(2000)) }).build('mysql')
assert.equal(updateQuery.sql, 'update books set status = ? where (publish_date >= ?)')
assert.deepEqual(updateQuery.params, [ 'archived', 2000 ])


let deleteQuery = deleteFrom(table('accounts')).where(column('activated'), false).build('sqlite')
assert.equal(deleteQuery.sql, 'delete from "accounts" where "activated" = ?')
assert.deepEqual(deleteQuery.params, [ false ])
```

### Custom compiler

If you may use a custom query compiler instead of the built-in ones, you can pass its instance to `build()`

```js
// in path/to/maria-compiler.js
import MysqlCompiler from 'vitamin-query/compiler/mysql'

class MariaCompiler extends MysqlCompiler {
  
  ...
  
}

// later, you can use its instance with any query instance
import * as qb from 'vitamin-query'

let query = qb.selectFrom('table').build(new MariaCompiler())
```

### API

For examples of usage, please refer to the tests.

| query | Expression | Aggregates | Conditional | Functions |
| ----- | ---------- | ---------- | ----------- | --------- |
| select | column | sum | eq | upper, ucase |
| selectFrom | table | avg | ne | lower, lcase |
| insert | sq | max | gt | replace |
| insertInto | raw | min | lt | substr, substring |
| update | esc | count | gte | concat |
| deleteFrom | cast | | lte | len, length |
| | cte | | between | repeat |
| | | | in, $in | space |
| | | | between | strpos, position |
| | | | startsWith | left |
| | | | like | right |
| | | | and | trim |
| | | | not | ltrim |
| | | | or | rtrim |
| | | | exists | abs |
| | | | | round |
| | | | | rand, random |
| | | | | now, datetime |
| | | | | utc |
| | | | | today, curdate |
| | | | | clock, curtime |
| | | | | date |
| | | | | time |
| | | | | day |
| | | | | month |
| | | | | year |
| | | | | hour |
| | | | | minute |
| | | | | second |

## Testing

```bash
$ npm test
```

## Change log

- **v0.2.0** - _API breaking changes_
  - Remove the operator argument from `Criteria.where()` (issue #4)
  - Lowcase all the helper functions
  - Use class mixin to keep the code DRY
  - Fix minor bugs  and typos

- **v0.1.2** - _Add new datetime helpers_

- **v0.1.1** - _Add helpers for SQL functions_
  - Configure Travis CI
  - Update README.md
  - Add helpers for SQL functions
  - Fix minor bugs
  
- **v0.1.0** - _Intial release_