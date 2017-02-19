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
    },
    ['foo', 30, 'bar', 40]
  )
  
  support.test(
    "inserts an new row with default values",
    qb.insertInto('people').defaultValues(),
    {
      pg:     'insert into people default values',
      mysql:  'insert into people () values ()',
      mssql:  'insert into people default values',
      sqlite: 'insert into people default values',
    }
  )

  support.test(
    "replaces missing bindings with default for multirow insert",
    qb.insert([{ x: 20 }, { y: 40 }, { x: 10, y: 30 }]).into('coords'),
    {
      pg:     'insert into coords (x, y) values ($1, default), (default, $2), ($3, $4)',
      mysql:  'insert into coords (x, y) values (?, default), (default, ?), (?, ?)',
      mssql:  'insert into coords (x, y) values (@1, default), (default, @2), (@3, @4)',
      sqlite: 'insert into coords (x, y) values ($1, null), (null, $2), ($3, $4)',
    },
    [20, 40, 10, 30]
  )

  support.test(
    "adds a returning clause",
    qb.insert({ fname: "foo", lname: 'bar' }).into('users').returning('id'),
    {
      pg:     'insert into users (fname, lname) values ($1, $2) returning id',
      mysql:  'insert into users (fname, lname) values (?, ?)',
      mssql:  'insert into users (fname, lname) output id values (@1, @2)',
      sqlite: 'insert into users (fname, lname) values ($1, $2)',
    },
    ['foo', 'bar']
  )

})