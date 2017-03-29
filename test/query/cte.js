/* global describe */

var support = require('../support')
var qb      = require('../../lib')
var cte     = qb.cte
var raw     = qb.raw
var sq      = qb.sq
var lt      = qb.lt

describe("test building insert queries:", () => {

  support.test(
    "using a common table expression within select query",
    qb.select('*').with(cte('select * from foo').as('cte')),
    {
      pg:     'with "cte" as (select * from foo) select *',
      mssql:  'with [cte] as (select * from foo) select *',
      sqlite: 'with "cte" as (select * from foo) select *',
    }
  )

  support.test(
    "using multiple cte within select query",
    qb.select('*').with(cte(qb.selectFrom('foo')).as('cte1')).with(cte('select * from bar').as('cte2', 'a', 'b')),
    {
      pg:     'with "cte1" as (select * from foo), "cte2"("a", "b") as (select * from bar) select *',
      mssql:  'with [cte1] as (select * from foo), [cte2]([a], [b]) as (select * from bar) select *',
      sqlite: 'with "cte1" as (select * from foo), "cte2"("a", "b") as (select * from bar) select *',
    }
  )

  support.test(
    "accepts insert query as a common table expression",
    qb.select('*').with(cte(qb.insert({ name: "foo", age: 30 }).into('people').returning('*')).as('inserted')),
    {
      pg:     'with "inserted" as (insert into people (name, age) values ($1, $2) returning *) select *',
    },
    [ 'foo', 30 ]
  )

  support.test(
    "accepts delete query as a common table expression",
    qb.insertInto('history').select(raw('select * from removed')).with(qb.deleteFrom('posts').where('published_at', lt('2012-01-01')).retruning('*').toCTE().as('removed')),
    {
      pg:     'with "removed" as (delete from posts where published_at > $1 returning *) insert into history select * from removed',
    },
    [ '2012-01-01' ]
  )

  support.test(
    "using a common table expression within an insert query",
    qb.insertInto('table').select(qb.selectFrom('cte')).with(raw('cte as (values(?))', 123)),
    {
      pg:     'with cte as (values($1)) insert into table select * from cte',
      mssql:  'with cte as (values(?)) insert into table select * from cte',
      sqlite: 'with cte as (values(?)) insert into table select * from cte',
    },
    [ 123 ]
  )

})