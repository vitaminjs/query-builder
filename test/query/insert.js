/* global describe */

var qb = require('../../lib').default
var support = require('./support')

describe("test building insert queries:", () => {

  support.test(
    "returns empty string if the table name is missing",
    qb.insert({ name: "foo", age: 30 }),
    {
      pg:     '',
      mysql:  '',
      mssql:  '',
      sqlite: '',
      oracle: '',
    }
  )

  support.test(
    "accepts a plain object data for single row insert",
    qb.insert({ name: "foo", age: 30 }).into('people'),
    {
      pg:     'insert into people (name, age) values ($1, $2)',
      mysql:  'insert into people (name, age) values (?, ?)',
      mssql:  'insert into people (name, age) values (@1, @2)',
      sqlite: 'insert into people (name, age) values ($1, $2)',
      oracle: 'insert into people (name, age) values (:1, :2)',
    },
    ['foo', 30]
  )

  support.test(
    "accepts an array of plain objects for multirow insert",
    qb.insert([{ name: "foo", age: 30 }, { name: "bar", age: 40 }]).into('people'),
    {
      pg:     'insert into people (name, age) values ($1, $2), ($3, $4)',
      mysql:  'insert into people (name, age) values (?, ?), (?, ?)',
      mssql:  'insert into people (name, age) values (@1, @2), (@3, @4)',
      sqlite: 'insert into people (name, age) values ($1, $2), ($3, $4)',
      oracle: 'insert into people (name, age) select :1, :2 from dual union all select :3, :4 from dual',
    },
    ['foo', 30, 'bar', 40]
  )

})