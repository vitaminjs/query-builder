[![Build Status](https://travis-ci.org/vitaminjs/query-builder.svg?branch=master)](https://travis-ci.org/vitaminjs/query-builder)

A fluent SQL query builder for Node.js
It provides support for:
- **PostgreSQL** (v9.5+)
- **SQLite** (v3.15.0+)
- **MySQL** (v5.7+)
- **MSSQL** (2012+)

## Installing

```bash
$ npm install --save vitamin-query
```

## Getting started

`vitamin-query` is composed of a set of useful expressions and helpers to build SQL queries easily

### building queries

```js
// import the query builder
import { table, select, selectFrom } from 'vitamin-query'

// Select query
let query = table('employees').select('count(*)').where('salary between ? and (?1 * 2)', 1500).toQuery('pg')
assert.equal(query.sql, 'select count(*) from employees where salary between $1 and ($2 * 2)')
assert.deepEqual(query.params, [ 1500, 1500 ])

// Compound query
let query = selectFrom('t').where('a is null').union(selectFrom('t').where('b is null')).toQuery('pg')
assert.equal(query.sql, 'select * from t where a is null union select * from t where b is null')

// Insert query
let fred = { name: "Fred", score: 30 }
let query = table('players').insert(fred).returning('*').toQuery('mssql')
assert.equal(query.sql, 'insert into players (name, score) output inserted.* values (?, ?)')
assert.deepEqual(query.params, [ 'Fred', 30 ])

// Update query
let query = table('books').update('status', 'archived').where('publish_date <= ?', 2000).toQuery('mysql')
assert.equal(query.sql, 'update books set status = ? where publish_date <= ?')
assert.deepEqual(query.params, [ 'archived', 2000 ])

// Delete query
let query = table('accounts').delete().where({ activated: false, deleted: true }).toQuery('sqlite')
assert.equal(query.sql, 'delete from accounts where activated = ? and deleted = ?')
assert.deepEqual(query.params, [ false, true ])
```

### Custom compiler

If you may use a custom query compiler instead of the built-in ones, you can pass its instance to `toQuery()`

```js
// in path/to/maria-compiler.js
import MysqlCompiler from 'vitamin-query/compiler/mysql'

class MariaCompiler extends MysqlCompiler { ... }

// later, you can use its instance with any query instance
import qb from 'vitamin-query'

let query = qb.select().from('table').toQuery(new MariaCompiler({ /* options */ }))
```

## API

For examples of usage, please refer to the tests

### Expression helpers

These Helpers are functions that return Expression instances:

- **alias**(expr, name: string; ...columns: string[]): IAlias
- **table**(value: string | IExpression): ITable
- **func**(name: string, ...args): IFunction
- **raw**(expr: string, ...args): ILiteral
- **values**(data: any[][]): IValues
- **id**(name: string): IIdentifier
- **esc**(value: string): ILiteral
- **selectFrom**(table): ISelect
- **select**(...fields): ISelect
- **val**(value): ILiteral
- **desc**(expr): IOrder
- **asc**(expr): IOrder

### Function helpers

Helpers to emulate the SQL built-in functions

- **substr | substring**(expr, start: number, length?: number): IFunction
- **replace**(expr, pattern, replacement): IFunction
- **strpos | position**(str, substr): IFunction
- **repeat**(expr, count: number): IFunction
- **right**(expr, length: number): IFunction
- **left**(expr, length: number): IFunction
- **round**(expr, n: number): IFunction
- **space**(length: number): IFunction
- **upper | ucase**(expr): IFunction
- **lower | lcase**(expr): IFunction
- **len | length**(expr): IFunction
- **today | curdate**(): IFunction
- **clock | curtime**(): IFunction
- **concat**(...parts): IFunction
- **now | datetime**(): IFunction
- **rand | random**(): IFunction
- **minute**(expr): IFunction
- **second**(expr): IFunction
- **ltrim**(expr): IFunction
- **rtrim**(expr): IFunction
- **month**(expr): IFunction
- **date**(expr): IFunction
- **time**(expr): IFunction
- **trim**(expr): IFunction
- **year**(expr): IFunction
- **hour**(expr): IFunction
- **abs**(expr): IFunction
- **day**(expr): IFunction
- **utc**(): IFunction

## Testing

```bash
$ npm test
```

## Change log

- **v1.0.0-alpha** - _TypeScript version of the library_

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
