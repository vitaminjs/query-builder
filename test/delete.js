/* global describe */

var support = require('./support')
var qb = require('../lib/builder').factory

describe('test building delete queries:', () => {
  support.test(
    'creates a basic delete query',
    qb('foo').delete(),
    {
      pg: 'delete from "foo"',
      mysql: 'delete from `foo`',
      mssql: 'delete from [foo]',
      sqlite: 'delete from "foo"'
    }
  )

  support.test(
    'creates a conditional delete query',
    qb('accounts').delete().where('activated = ?', false),
    {
      pg: 'delete from "accounts" where activated = $1',
      mysql: 'delete from `accounts` where activated = ?',
      mssql: 'delete from [accounts] where activated = ?',
      sqlite: 'delete from "accounts" where activated = ?'
    },
    [
      false
    ]
  )

  support.test(
    'creates a basic delete query',
    qb('baz').delete().where({ id: 1 }).returning('*'),
    {
      pg: 'delete from "baz" where id = $1 returning *',
      mssql: 'delete from [baz] output deleted.* where id = ?'
    },
    [
      1
    ]
  )
})
