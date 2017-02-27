/* global describe */

var qb      = require('../../lib').default
var fn      = require('../../lib/helpers')
var support = require('../support')
var RAW     = fn.RAW
var MAX     = fn.MAX
var SQ      = fn.SQ
var C       = fn.C
var T       = fn.T

describe("test building update queries:", () => {

  support.test(
    "returns empty string if the values are missing",
    qb.update('table'),
    {
      pg:     '',
      mysql:  '',
      mssql:  '',
      sqlite: '',
    }
  )

  support.test(
    "generates a basic update query using plain object data",
    qb.update('books').set({ status: 'archived' }).where('publish_date', '<', 2000),
    {
      pg:     'update books set status = $1 where publish_date < $2',
      mysql:  'update books set status = ? where publish_date < ?',
      mssql:  'update books set status = ? where publish_date < ?',
      sqlite: 'update books set status = ? where publish_date < ?',
    },
    ['archived', 2000]
  )

  support.test(
    "generates a basic update query using key/value format",
    qb.update('books').set('status', 'archived').where(RAW`publish_date < ${2000}`),
    {
      pg:     'update books set status = $1 where publish_date < $2',
      mysql:  'update books set status = ? where publish_date < ?',
      mssql:  'update books set status = ? where publish_date < ?',
      sqlite: 'update books set status = ? where publish_date < ?',
    },
    ['archived', 2000]
  )

  support.test(
    "adds more values for multiple call of set",
    qb.update('table').set('name', 'Foo').set('b', null).set('c', undefined),
    {
      pg:     'update table set name = $1, b = $2, c = default',
      mysql:  'update table set name = ?, b = ?, c = default',
      mssql:  'update table set name = ?, b = ?, c = default',
      sqlite: 'update table set name = ?, b = ?, c = null',
    },
    [ 'Foo', null ]
  )

  support.test(
    "generates an update query using a sub query",
    qb.update('players').set('level', SQ(qb.select(MAX('level')).from('levels'))).where('id', 123),
    {
      pg:     'update players set level = (select max(level) from levels) where id = $1',
      mysql:  'update players set level = (select max(level) from levels) where id = ?',
      mssql:  'update players set level = (select max(level) from levels) where id = ?',
      sqlite: 'update players set level = (select max(level) from levels) where id = ?',
    },
    [ 123 ]
  )

  support.test(
    "adds a returning clause",
    qb.update('foo').set('a', RAW`a + 1`).where('a', '<', 3).returning('*'),
    {
      pg:     'update foo set a = a + 1 where a < $1 returning *',
      mysql:  'update foo set a = a + 1 where a < ?',
      mssql:  'update foo set a = a + 1 output inserted.* where a < ?',
      sqlite: 'update foo set a = a + 1 where a < ?',
    },
    [ 3 ]
  )

})