/* global describe */

var qb = require('../lib')
var support = require('./support')

describe('test building select queries:', () => {
  describe('test select():', () => {
    support.test(
      'returns empty string for empty queries',
      qb.select(),
      {
        pg: '',
        mysql: '',
        mssql: '',
        sqlite: ''
      }
    )

    support.test(
      'accepts literal values',
      qb.select(123, true, null, "'xyz'"),
      {
        pg: "select 123, true, null, 'xyz'",
        mysql: "select 123, true, null, 'xyz' from dual",
        mssql: "select 123, true, null, 'xyz'",
        sqlite: "select 123, true, null, 'xyz'"
      }
    )

    support.test(
      'accepts raw expressions',
      qb.select(qb.raw('(1 + ?) as operation', 2)),
      {
        pg: 'select (1 + $1) as operation',
        mysql: 'select (1 + ?) as operation from dual',
        mssql: 'select (1 + ?) as operation',
        sqlite: 'select (1 + ?) as operation'
      },
      [
        2
      ]
    )

    support.test(
      'accepts sub queries',
      qb.select(qb.select('count(*)').from('atable').as('result')),
      {
        pg: 'select (select count(*) from atable) as "result"',
        mysql: 'select (select count(*) from atable) as `result` from dual',
        mssql: 'select (select count(*) from atable) as [result]',
        sqlite: 'select (select count(*) from atable) as "result"'
      }
    )

    support.test(
      'selects distinct columns',
      qb.select('foo', qb.id('bar')).distinct(),
      {
        pg: 'select distinct foo, "bar"',
        mysql: 'select distinct foo, `bar` from dual',
        mssql: 'select distinct foo, [bar]',
        sqlite: 'select distinct foo, "bar"'
      }
    )
  })

  describe('test from():', () => {
    support.test(
      'accepts a raw table expression',
      qb.selectFrom('table'),
      {
        pg: 'select * from table',
        mysql: 'select * from table',
        mssql: 'select * from table',
        sqlite: 'select * from table'
      }
    )

    support.test(
      'adds a table expression',
      qb.selectFrom(qb.id('schema.table').as('alias')),
      {
        pg: 'select * from "schema"."table" as "alias"',
        mysql: 'select * from `schema`.`table` as `alias`',
        mssql: 'select * from [schema].[table] as [alias]',
        sqlite: 'select * from "schema"."table" as "alias"'
      }
    )

    support.test(
      'accepts more than one table for `from` clause',
      qb.selectFrom('a', 'b'),
      {
        pg: 'select * from a, b',
        mysql: 'select * from a, b',
        mssql: 'select * from a, b',
        sqlite: 'select * from a, b'
      }
    )

    support.test(
      'appends more tables when called multiple times',
      qb.select().from('a').from('b'),
      {
        pg: 'select * from a, b',
        mysql: 'select * from a, b',
        mssql: 'select * from a, b',
        sqlite: 'select * from a, b'
      }
    )

    support.test(
      'accepts raw expressions',
      qb.selectFrom(qb.raw('schema.table as t')),
      {
        pg: 'select * from schema.table as t',
        mysql: 'select * from schema.table as t',
        mssql: 'select * from schema.table as t',
        sqlite: 'select * from schema.table as t'
      }
    )

    support.test(
      'accepts sub queries',
      qb.selectFrom(qb.select('*').from('a_table').as('t')),
      {
        pg: 'select * from (select * from a_table) as "t"',
        mysql: 'select * from (select * from a_table) as `t`',
        mssql: 'select * from (select * from a_table) as [t]',
        sqlite: 'select * from (select * from a_table) as "t"'
      }
    )
  })
})
