/* global describe */

var support = require('./support')
var { select, selectFrom, table, raw } = require('../dist')

describe('test building insert queries:', () => {
  support.test(
    'using a common table expression within select query',
    select('*').addCTE(selectFrom('foo').as('cte')),
    {
      pg: 'with "cte" as (select * from "foo") select *',
      mssql: 'with [cte] as (select * from [foo]) select *',
      sqlite: 'with "cte" as (select * from "foo") select *'
    }
  )

  support.test(
    'using multiple cte within select query',
    select('*').addCTE(selectFrom('foo').as('cte1')).addCTE(raw('cte2 (a, b) as (select * from bar)')),
    {
      pg: 'with "cte1" as (select * from "foo"), cte2 (a, b) as (select * from bar) select *',
      mssql: 'with [cte1] as (select * from [foo]), cte2 (a, b) as (select * from bar) select *',
      sqlite: 'with "cte1" as (select * from "foo"), cte2 (a, b) as (select * from bar) select *'
    }
  )

  support.test(
    'accepts insert query as a common table expression',
    select('*').addCTE(table('people').insert({ name: 'foo', age: 30 }).returning('*').as('inserted')),
    {
      pg: 'with "inserted" as (insert into "people" ("name", "age") values ($1, $2) returning *) select *'
    },
    [
      'foo',
      30
    ]
  )

  support.test(
    'accepts delete query as a common table expression',
    selectFrom('removed').into('history').addCTE(table('posts').delete().where('published_at < ?', '2012-01-01').returning('*').as('removed')),
    {
      pg: 'with "removed" as (delete from "posts" where published_at < $1 returning *) insert into "history" select * from "removed"'
    },
    [
      '2012-01-01'
    ]
  )

  support.test(
    'using a common table expression within an insert query',
    selectFrom('cte').into('table').addCTE(raw('cte as (values(?))', 123)),
    {
      pg: 'with cte as (values($1)) insert into "table" select * from "cte"',
      mssql: 'with cte as (values(?)) insert into [table] select * from [cte]',
      sqlite: 'with cte as (values(?)) insert into "table" select * from "cte"'
    },
    [
      123
    ]
  )
})
