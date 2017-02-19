A fluent SQL query builder for Node.
It provides support for **SQLite**, **MySQL**, **PostgreSQL** and **MSSQL**.

## Installing

```bash
$ npm install --save vitamin-query
```

## Getting started

```js
// import the query builder and some helpers
import qb, { COUNT, RAW } from 'vitamin-query'

// build a basic select query
var query = qb.select(COUNT()).from('employees').where(RAW`salary > ${2000}`)

// compile the built query to SQL, using a database dialect
var q = query.toSQL('pg' || 'mysql' || 'mssql' || 'sqlite')

// assertions
assert.equal(q.sql, 'select count(*) from employees where salary > $1')
assert.deepEqual(q.params, [2000])
```

## Testing

```bash
$ npm test
```