/* global describe */

var qb      = require('../../lib').default
var fn      = require('../../lib/helpers')
var support = require('./support')
var C       = fn.C
var T       = fn.T

describe("test building delete queries:", () => {

  support.test(
    "creates a basic delete query",
    qb.deleteFrom('table'),
    {
      pg:     'delete from table',
      mysql:  'delete from table',
      mssql:  'delete from table',
      sqlite: 'delete from table',
    }
  )

  support.test(
    "creates a conditional delete query",
    qb.delete(T('accounts')).where(C('activated'), false),
    {
      pg:     'delete from "table" where "activated" = $1',
      mysql:  'delete from `table` where `activated` = ?',
      mssql:  'delete from [table] where [activated] = @1',
      sqlite: 'delete from "table" where "activated" = $1',
    }
  )

})