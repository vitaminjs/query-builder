/* global describe */

var qb      = require('../../lib').default
var fn      = require('../../lib/helpers')
var support = require('../support')
var C       = fn.C
var T       = fn.T

describe("test building insert queries:", () => {

  support.test(
    "returns empty string if the table name is missing",
    qb.insert({ name: "foo", age: 30 }),
    {
      pg:     '',
      mysql:  '',
      mssql:  '',
      sqlite: '',
    }
  )

  support.test(
    "accepts a plain object data for single row insert",
    qb.insert({ name: "foo", age: 30 }).into('people'),
    {
      pg:     'insert into people (name, age) values ($1, $2)',
      mysql:  'insert into people (name, age) values (?, ?)',
      mssql:  'insert into people (name, age) values (?, ?)',
      sqlite: 'insert into people (name, age) values (?, ?)',
    },
    ['foo', 30]
  )

  support.test(
    "accepts an array of plain objects for multirow insert",
    qb.insert([{ name: "foo", age: 30 }, { name: "bar", age: 40 }]).into('people'),
    {
      pg:     'insert into people (name, age) values ($1, $2), ($3, $4)',
      mysql:  'insert into people (name, age) values (?, ?), (?, ?)',
      mssql:  'insert into people (name, age) values (?, ?), (?, ?)',
      sqlite: 'insert into people (name, age) values (?, ?), (?, ?)',
    },
    ['foo', 30, 'bar', 40]
  )
  
  support.test(
    "inserts an new row with default values",
    qb.insertInto(T('table')).defaultValues(),
    {
      pg:     'insert into "table" default values',
      mysql:  'insert into `table` () values ()',
      mssql:  'insert into [table] default values',
      sqlite: 'insert into "table" default values',
    }
  )

  support.test(
    "replaces missing bindings with default for multirow insert",
    qb.insertInto('coords', C('y'), 'x').values([{ x: 20 }, { y: 40 }, { x: 10, y: 30 }]),
    {
      pg:     'insert into coords ("y", x) values (default, $1), ($2, default), ($3, $4)',
      mysql:  'insert into coords (`y`, x) values (default, ?), (?, default), (?, ?)',
      mssql:  'insert into coords ([y], x) values (default, ?), (?, default), (?, ?)',
      sqlite: 'insert into coords ("y", x) values (null, ?), (?, null), (?, ?)',
    },
    [20, 40, 30, 10]
  )

  support.test(
    "adds a returning clause",
    qb.insert({ fname: "foo", lname: 'bar' }).into('users').returning(C('id')),
    {
      pg:     'insert into users (fname, lname) values ($1, $2) returning "id"',
      mysql:  'insert into users (fname, lname) values (?, ?)',
      mssql:  'insert into users (fname, lname) output inserted.[id] values (?, ?)',
      sqlite: 'insert into users (fname, lname) values (?, ?)',
    },
    ['foo', 'bar']
  )

  support.test(
    "",
    qb.insertInto('table', 'a', 'b').select(qb.selectFrom('another_table').limit(3)),
    {
      pg:     'insert into table (a, b) select * from another_table limit $1',
      mysql:  'insert into table (a, b) select * from another_table limit ?',
      mssql:  'insert into table (a, b) select top(?) * from another_table',
      sqlite: 'insert into table (a, b) select * from another_table limit ?',
    },
    [ 3 ]
  )

})