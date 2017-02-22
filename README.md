A fluent SQL query builder for Node.
It provides support for **SQLite**, **MySQL**, **PostgreSQL** and **MSSQL**.

## Installing

```bash
$ npm install --save vitamin-query
```

## Getting started

### Select query

```js
// import the query builder and some helpers
import qb, { COUNT, RAW } from 'vitamin-query'

// build a basic select query
// use PostgreSQL dialect for SQL compilation
let query = qb.select(COUNT()).from('employees').where(RAW`salary > ${1500}`).toSQL('pg')

// assertions
assert.equal(query.sql, 'select count(*) from employees where salary > $1')
assert.deepEqual(query.params, [ 1500 ])
```

### Insert query

```js
// import the query builder and the `T` helper
import qb, { T } from 'vitamin-query'

let data = { name: "Fred", score: 30 }
let query = qb.insert(data).into(T('players')).returning('*').toSQL('mssql')

// assertions
assert.equal(query.sql, 'insert into [players] (name, score) output inserted.* values (@1, @2)')
assert.deepEqual(query.params, [ 'Fred', 30 ])
```

### Update query

```js
import qb from 'vitamin-query'

let query = qb.update('books').set('status', 'archived').where('publish_date', '<', 2000).toSQL('mysql')

assert.equal(query.sql, 'update books set status = ? where publish_date < ?')
assert.deepEqual(query.params, [ 'archived', 2000 ])
```

### Delete query

```js
import qb, { T, C } from 'vitamin-query'

let query = qb.deleteFrom(T('accounts')).where(C('activated'), false).toSQL('sqlite')

assert.equal(query.sql, 'delete from "accounts" where "activated" = $1')
assert.deepEqual(query.params, [ false ])
```

### Custom compiler

If you may use a custom query compiler instead of the built-in ones, you can pass its instance to `toSQL()`

```js
import BaseCompiler from 'vitamin-query/compiler'

class CustomCompiler extends BaseCompiler {
  
  // ...
  
}

// ...

// later with any query instance
let query = qb.selectFrom('table').toSQL(new CustomCompiler())
```

## Testing

```bash
$ npm test
```