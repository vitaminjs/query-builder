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
import * as qb from 'vitamin-query'


let select = qb.select().from('employees').where('salary > ?', 1500).toSQL('pg')
assert.equal(select.sql, 'select * from employees where salary > $1')
assert.deepEqual(select.params, [ 1500 ])


let data = { name: "Fred", score: 30 }
let insert = qb.insert(data).into('players').returning('*').toSQL('mssql')
assert.equal(insert.sql, 'insert into players (name, score) output inserted.* values (?, ?)')
assert.deepEqual(insert.params, [ 'Fred', 30 ])


let update = qb.update('books').set('status', 'archived').where('publish_date', '<', 2000).toSQL('mysql')
assert.equal(query3.sql, 'update books set status = ? where publish_date < ?')
assert.deepEqual(query3.params, [ 'archived', 2000 ])


let del = qb.deleteFrom(T('accounts')).where(C('activated'), false).toSQL('sqlite')
assert.equal(del.sql, 'delete from "accounts" where "activated" = ?')
assert.deepEqual(del.params, [ false ])
```

### Custom compiler

If you may use a custom query compiler instead of the built-in ones, you can pass its instance to `toSQL()`

```js
// in path/to/maria-compiler.js
import MysqlCompiler from 'vitamin-query/compiler/mysql'

class MariaCompiler extends MysqlCompiler {
  
  ...
  
}

// later, you can use its instance with any query instance
let query = qb.selectFrom('table').toSQL(new MariaCompiler())
```

### API

For examples of usage, please refer to the tests.

Expression  | Aggregates  | Conditional | Functions
----------  | ----------  | ----------- | ---------
C, COLUMN   | SUM         | EQ          | UPPER, UCASE
T, TABLE    | AVG         | NE          | LOWER, LCASE
SQ          | MAX         | GT          | REPLACE
RAW         | MIN         | LT          | SUBSTR, SUBSTRING
ESC         | COUNT       | GTE         | CONCAT
CAST        |             | LTE         | LENGTH, LEN
            |             | ISNULL      | REPEAT
            |             | IN          | SPACE
            |             | BETWEEN     | STRPOS, POSITION
            |             | STARTSWITH  | LEFT
            |             | ENDSWITH    | RIGHT
            |             | EXISTS      | TRIM
            |             | LIKE        | LTRIM
            |             |             | RTRIM
            |             |             | ABS
            |             |             | ROUND
            |             |             | RAND, RANDOM
            |             |             | NOW, DATETIME
            |             |             | UTC, UTC_DATETIME
            |             |             | TODAY, CURRENT_DATE
            |             |             | CLOCK, CURRENT_TIME
            |             |             | DATE
            |             |             | TIME
            |             |             | DAY
            |             |             | MONTH
            |             |             | YEAR
            |             |             | HOUR
            |             |             | MINUTE
            |             |             | SECOND

## Testing

```bash
$ npm test
```
