/* global describe */

var support = require('./support')
var raw = require('../lib/helpers').raw
var qb = require('../lib/builder').factory

describe('test common table expressions:', () => {
  support.test(
    'using a common table expression within select query',
    qb().with(qb('foo').as('cte')).select('*').from('cte'),
    {
      pg: 'with "cte" as (select * from "foo") select * from "cte"',
      mssql: 'with [cte] as (select * from [foo]) select * from [cte]',
      sqlite: 'with "cte" as (select * from "foo") select * from "cte"'
    }
  )

  support.test(
    'using a common table expression within an update query',
    qb().with(qb().select('email').from('users').where('age > 56').as('cte')).update({ foo: 'updatedFoo' }).where('email = cte.email').from('users'),
    {
      pg: 'with "cte" as (select email from "users" where age > 56) update "users" set "foo" = $1 where email = cte.email',
      mssql: 'with [cte] as (select email from [users] where age > 56) update [users] set [foo] = ? where email = cte.email',
      sqlite: 'with "cte" as (select email from "users" where age > 56) update "users" set "foo" = ? where email = cte.email'
    },
    [
      'updatedFoo'
    ]
  )

  support.test(
    'using a common table expression within delete query',
    qb().with(qb().select('email').from('users').as('cte')).from('users').delete().where('foo = ?', 'updatedFoo'),
    {
      pg: 'with "cte" as (select email from "users") delete from "users" where foo = $1',
      mssql: 'with [cte] as (select email from [users]) delete from [users] where foo = ?',
      sqlite: 'with "cte" as (select email from "users") delete from "users" where foo = ?'
    },
    [
      'updatedFoo'
    ]
  )

  support.test(
    'using multiple cte within select query',
    qb().with(qb('foo').as('cte1')).with(raw('cte2 (a, b) as (select * from bar)')).select('*'),
    {
      pg: 'with "cte1" as (select * from "foo"), cte2 (a, b) as (select * from bar) select *',
      mssql: 'with [cte1] as (select * from [foo]), cte2 (a, b) as (select * from bar) select *',
      sqlite: 'with "cte1" as (select * from "foo"), cte2 (a, b) as (select * from bar) select *'
    }
  )

  support.test(
    'accepts insert query as a common table expression',
    qb().with(qb('people').insert({ name: 'foo', age: 30 }).returning('*').as('inserted')).select('id').from('inserted'),
    {
      pg: 'with "inserted" as (insert into "people" ("name", "age") values ($1, $2) returning *) select id from "inserted"'
    },
    [
      'foo',
      30
    ]
  )

  support.skip(
    'accepts delete query as a common table expression',
    qb().with(qb('posts').delete().where('published_at < ?', '2012-01-01').returning('*').as('removed')).select().from('removed').into('history'),
    {
      pg: 'with "removed" as (delete from "posts" where published_at < $1 returning *) insert into "history" select * from "removed"'
    },
    [
      '2012-01-01'
    ]
  )

  support.skip(
    'using a common table expression within an insert query',
    qb().with(raw('cte as (values(?))', 123)).select().from('cte').into('table'),
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
