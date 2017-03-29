/* global describe */

var qb      = require('../../lib')
var support = require('../support')
var C       = qb.column
var T       = qb.table

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
    qb.deleteFrom(T('accounts')).where(T('activated'), false),
    {
      pg:     'delete from "accounts" where "activated" = $1',
      mysql:  'delete from `accounts` where `activated` = ?',
      mssql:  'delete from [accounts] where [activated] = ?',
      sqlite: 'delete from "accounts" where "activated" = ?',
    },
    [ false ]
  )
  
  support.test(
    "creates a basic delete query",
    qb.deleteFrom('table').where({ id: 1 }).returning('*'),
    {
      pg:     'delete from table where (id = $1) returning *',
      mssql:  'delete from table output deleted.* where (id = ?)',
    },
    [1]
  )

})