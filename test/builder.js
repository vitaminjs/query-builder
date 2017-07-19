/* global describe */

var qb = require('../lib')
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
    qb({ select: [ qb.id('foo') ], table: qb.id('bar'), limit: 15 }),
    {
      pg: 'select "foo" from "bar"',
      mysql: 'select `foo` from `bar`',
      mssql: 'select [foo] from [bar]',
      sqlite: 'select "foo" from "bar"'
    }
  )
})
