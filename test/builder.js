/* global describe */

var id = require('../lib').id
var qb = require('../lib').default
var support = require('./support')

describe('test query builder:', function () {
  support.test(
    'returns empty string for empty queries',
    qb(),
    {
      pg: '',
      mysql: '',
      mssql: '',
      sqlite: ''
    }
  )

  support.test(
    'inits with a table name',
    qb('foo'),
    {
      pg: 'select * from "foo"',
      mysql: 'select * from `foo`',
      mssql: 'select * from [foo]',
      sqlite: 'select * from "foo"'
    }
  )

  support.test(
    'inits with a query object',
    qb({ fields: [ id('foo') ], table: id('bar'), limit: 15 }),
    {
      pg: 'select "foo" from "bar" limit $1',
      mysql: 'select `foo` from `bar` limit ?',
      mssql: 'select top (?) [foo] from [bar]',
      sqlite: 'select "foo" from "bar" limit ?'
    },
    [
      15
    ]
  )
})
