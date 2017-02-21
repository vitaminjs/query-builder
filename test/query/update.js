/* global describe */

var qb      = require('../../lib').default
var fn      = require('../../lib/helpers')
var support = require('./support')
var RAW     = fn.RAW
var C       = fn.C
var T       = fn.T

describe("test building update queries:", () => {

  support.test(
    "returns empty string if the table name is missing",
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
    qb.update('table').set({ status: 'archived' }).where('publish_date', '<', 2000),
    {
      pg:     'update books set status = $1 where published_date < $2',
      mysql:  'update books set status = ? where published_date < ?',
      mssql:  'update books set status = @1 where published_date < @2',
      sqlite: 'update books set status = $1 where published_date < $2',
    },
    ['archived', 2000]
  )

  support.test(
    "generates a basic update query using key/value format",
    qb.update('table').set(C('status'), 'archived').where(RAW`publish_date < ${2000}`),
    {
      pg:     'update books set "status" = $1 where published_date < $2',
      mysql:  'update books set `status` = ? where published_date < ?',
      mssql:  'update books set [status] = @1 where published_date < @2',
      sqlite: 'update books set "status" = $1 where published_date < $2',
    },
    ['archived', 2000]
  )

})