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
      pg:     'delete from "accounts" where "activated" = $1',
      mysql:  'delete from `accounts` where `activated` = ?',
      mssql:  'delete from [accounts] where [activated] = @1',
      sqlite: 'delete from "accounts" where "activated" = $1',
    },
    [ false ]
  )
  
  support.test(
    "creates a basic delete query",
    qb.deleteFrom('table').where({ id: 1 }).returning('*'),
    {
      pg:     'delete from table where (id = $1) returning *',
      mysql:  'delete from table where (id = ?)',
      mssql:  'delete from table output deleted.* where (id = @1)',
      sqlite: 'delete from table where (id = $1)',
    },
    [1]
  )

})