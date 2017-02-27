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

```js
// import the query builder and some helpers
import qb, { COUNT, RAW, T, C } from 'vitamin-query'

// => Select query

let query1 = qb.select(COUNT()).from('employees').where(RAW`salary > ${1500}`).toSQL('pg')
assert.equal(query1.sql, 'select count(*) from employees where salary > $1')
assert.deepEqual(query1.params, [ 1500 ])

// => Insert query

let data = { name: "Fred", score: 30 }
let query2 = qb.insert(data).into(T('players')).returning('*').toSQL('mssql')
assert.equal(query2.sql, 'insert into [players] (name, score) output inserted.* values (?, ?)')
assert.deepEqual(query2.params, [ 'Fred', 30 ])

// => Update query

let query3 = qb.update('books').set('status', 'archived').where('publish_date', '<', 2000).toSQL('mysql')
assert.equal(query3.sql, 'update books set status = ? where publish_date < ?')
assert.deepEqual(query3.params, [ 'archived', 2000 ])

// => Delete query

let query4 = qb.deleteFrom(T('accounts')).where(C('activated'), false).toSQL('sqlite')
assert.equal(query4.sql, 'delete from "accounts" where "activated" = ?')
assert.deepEqual(query4.params, [ false ])
```

### Custom compiler

If you may use a custom query compiler instead of the built-in ones, you can pass its instance to `toSQL()`

```js
import MysqlCompiler from 'vitamin-query/compiler/mysql'

// in path/to/maria-compiler.js
class MariaCompiler extends MysqlCompiler {
  
  // ...
  
}

// later, you can use its instance with any query instance
let query = qb.selectFrom('table').toSQL(new MariaCompiler())
```

## Testing

```bash
$ npm test
```
