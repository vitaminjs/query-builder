/* global describe */

var Select = require('../../lib/query').Select
var fn = require('../../lib/helpers')
var qb = require('../../lib').default
var support = require('../support')
var assert = require('assert')
var EXISTS  = fn.EXISTS
var COUNT   = fn.COUNT
var RAW     = fn.RAW
var MAX     = fn.MAX
var MIN     = fn.MIN
var SUM     = fn.SUM
var SQ      = fn.SQ
var IN      = fn.IN
var T       = fn.T
var C       = fn.C

describe("test building select queries:", () => {
  
  describe("test select():", () => {
    
    support.test(
      "returns empty string for empty queries",
      qb.select(),
      {
        pg:     '',
        mysql:  '',
        mssql:  '',
        sqlite: '',
      }
    )
    
    support.test(
      "accepts literal expressions",
      qb.select(123, 'xXx'),
      {
        pg:     'select 123, xXx',
        mysql:  'select 123, xXx from dual',
        mssql:  'select 123, xXx',
        sqlite: 'select 123, xXx',
      }
    )
    
    support.test(
      "accepts raw expressions",
      qb.select(RAW('1 + ?', 2).as('operation').wrap()),
      {
        pg:     'select (1 + $1) as "operation"',
        mysql:  'select (1 + ?) as `operation` from dual',
        mssql:  'select (1 + ?) as [operation]',
        sqlite: 'select (1 + ?) as "operation"',
      },
      [2]
    )
    
    support.test(
      "accepts aggregates",
      qb.select(COUNT('foo').distinct().as('foo_count')),
      {
        pg:     'select count(distinct foo) as "foo_count"',
        mysql:  'select count(distinct foo) as `foo_count` from dual',
        mssql:  'select count(distinct foo) as [foo_count]',
        sqlite: 'select count(distinct foo) as "foo_count"',
      }
    )
    
    support.test(
      "accepts sub queries",
      qb.select(SQ('select count(*) from table').as('column')),
      {
        pg:     'select (select count(*) from table) as "column"',
        mysql:  'select (select count(*) from table) as `column` from dual',
        mssql:  'select (select count(*) from table) as [column]',
        sqlite: 'select (select count(*) from table) as "column"',
      }
    )

    support.test(
      "accepts column expressions",
      qb.select(C('foo as bar'), MAX(C('baz')).as('dummy')),
      {
        pg:     'select "foo" as "bar", max("baz") as "dummy"',
        mysql:  'select `foo` as `bar`, max(`baz`) as `dummy` from dual',
        mssql:  'select [foo] as [bar], max([baz]) as [dummy]',
        sqlite: 'select "foo" as "bar", max("baz") as "dummy"',
      }
    )

    support.test(
      "selects distinct columns",
      qb.select('foo', C('bar')).distinct(),
      {
        pg:     'select distinct foo, "bar"',
        mysql:  'select distinct foo, `bar` from dual',
        mssql:  'select distinct foo, [bar]',
        sqlite: 'select distinct foo, "bar"',
      }
    )
    
  })

  describe("test from():", () => {

    support.test(
      "accepts a raw table expression",
      qb.select().from('table'),
      {
        pg:     'select * from table',
        mysql:  'select * from table',
        mssql:  'select * from table',
        sqlite: 'select * from table',
      }
    )

    support.test(
      "adds a table expression",
      qb.selectFrom(T('schema.table as alias')),
      {
        pg:     'select * from "schema"."table" as "alias"',
        mysql:  'select * from `schema`.`table` as `alias`',
        mssql:  'select * from [schema].[table] as [alias]',
        sqlite: 'select * from "schema"."table" as "alias"',
      }
    )

    support.test(
      "accepts more than one table for `from` clause",
      qb.selectFrom('foo', 'bar'),
      {
        pg:     'select * from foo, bar',
        mysql:  'select * from foo, bar',
        mssql:  'select * from foo, bar',
        sqlite: 'select * from foo, bar',
      }
    )
    
    support.test(
      "appends more tables when called multiple times",
      qb.select().from('foo').from('bar'),
      {
        pg:     'select * from foo, bar',
        mysql:  'select * from foo, bar',
        mssql:  'select * from foo, bar',
        sqlite: 'select * from foo, bar',
      }
    )

    support.test(
      "accepts raw expressions",
      qb.select().from(RAW('schema.table').as('t')),
      {
        pg:     'select * from schema.table as "t"',
        mysql:  'select * from schema.table as `t`',
        mssql:  'select * from schema.table as [t]',
        sqlite: 'select * from schema.table as "t"',
      }
    )

    support.test(
      "accepts sub queries",
      qb.selectFrom(qb.select('*').from('a_table').as('t')),
      {
        pg:     'select * from (select * from a_table) as "t"',
        mysql:  'select * from (select * from a_table) as `t`',
        mssql:  'select * from (select * from a_table) as [t]',
        sqlite: 'select * from (select * from a_table) as "t"',
      }
    )

  })

  describe("test join():", () => {

    support.test(
      "adds a basic join clause",
      qb.select().from(T('posts as p')).join(T('users as a'), C('p.author_id'), C('a.id')),
      {
        pg:     'select * from "posts" as "p" inner join "users" as "a" on "p"."author_id" = "a"."id"',
        mysql:  'select * from `posts` as `p` inner join `users` as `a` on `p`.`author_id` = `a`.`id`',
        mssql:  'select * from [posts] as [p] inner join [users] as [a] on [p].[author_id] = [a].[id]',
        sqlite: 'select * from "posts" as "p" inner join "users" as "a" on "p"."author_id" = "a"."id"',
      }
    )

    support.test(
      "adds a raw join expression",
      qb.selectFrom(T('table1')).join(RAW`natural full join ${T('table2')}`),
      {
        pg:     'select * from "table1" natural full join "table2"',
        mysql:  'select * from `table1` natural full join `table2`',
        mssql:  'select * from [table1] natural full join [table2]',
        sqlite: 'select * from "table1" natural full join "table2"',
      }
    )

    support.test(
      "adds a table join with more than one condition",
      qb.selectFrom('departments dept').join('employees emp', cr => cr.where(RAW('emp.department_id = dept.id')).where('emp.salary', '>', 2500)),
      {
        pg:     'select * from departments dept inner join employees emp on (emp.department_id = dept.id and emp.salary > $1)',
        mysql:  'select * from departments dept inner join employees emp on (emp.department_id = dept.id and emp.salary > ?)',
        mssql:  'select * from departments dept inner join employees emp on (emp.department_id = dept.id and emp.salary > ?)',
        sqlite: 'select * from departments dept inner join employees emp on (emp.department_id = dept.id and emp.salary > ?)',
      },
      [2500]
    )

    support.test(
      "adds a table join with raw conditions",
      qb.selectFrom('people p').join('category c', RAW('p.salary >= c.min_salary and p.salary <= c.max_salary').wrap()),
      {
        pg:     'select * from people p inner join category c on (p.salary >= c.min_salary and p.salary <= c.max_salary)',
        mysql:  'select * from people p inner join category c on (p.salary >= c.min_salary and p.salary <= c.max_salary)',
        mssql:  'select * from people p inner join category c on (p.salary >= c.min_salary and p.salary <= c.max_salary)',
        sqlite: 'select * from people p inner join category c on (p.salary >= c.min_salary and p.salary <= c.max_salary)',
      }
    )

    support.test(
      "adds a join with a sub query",
      qb.selectFrom('table1').crossJoin(q => q.select().from('table2')),
      {
        pg:     'select * from table1 cross join (select * from table2)',
        mysql:  'select * from table1 cross join (select * from table2)',
        mssql:  'select * from table1 cross join (select * from table2)',
        sqlite: 'select * from table1 cross join (select * from table2)',
      }
    )

  })

  describe("test where():", () => {
    
    support.test(
      "adds a basic where condition",
      qb.select().from('table').where('id', 123),
      {
        pg:     'select * from table where id = $1',
        mysql:  'select * from table where id = ?',
        mssql:  'select * from table where id = ?',
        sqlite: 'select * from table where id = ?',
      },
      [123]
    )
    
    support.test(
      "adds multiple where conditions",
      qb.selectFrom('table').where('a', 'x').whereNot('b', '<', 300).orWhere('c', 'like', 'zoo%'),
      {
        pg:     'select * from table where a = $1 and b >= $2 or c like $3',
        mysql:  'select * from table where a = ? and b >= ? or c like ?',
        mssql:  'select * from table where a = ? and b >= ? or c like ?',
        sqlite: 'select * from table where a = ? and b >= ? or c like ?',
      },
      ['x', 300, 'zoo%']
    )
    
    support.test(
      "accepts raw expressions",
      qb.selectFrom('table').where(RAW('a = ? or b != ?', 'x', 'y')),
      {
        pg:     'select * from table where a = $1 or b != $2',
        mysql:  'select * from table where a = ? or b != ?',
        mssql:  'select * from table where a = ? or b != ?',
        sqlite: 'select * from table where a = ? or b != ?',
      },
      ['x', 'y']
    )
    
    support.test(
      "accepts object expressions",
      qb.selectFrom('table').where({ a: 123, b: ['foo', 'bar'], c: null }),
      {
        pg:     'select * from table where (a = $1 and b in ($2, $3) and c is null)',
        mysql:  'select * from table where (a = ? and b in (?, ?) and c is null)',
        mssql:  'select * from table where (a = ? and b in (?, ?) and c is null)',
        sqlite: 'select * from table where (a = ? and b in (?, ?) and c is null)',
      },
      [123, 'foo', 'bar']
    )
    
    support.test(
      "accepts nested conditions",
      qb.selectFrom('table').whereNot(cr => cr.where('a', null).orWhere('b', 'between', [10, 20])),
      {
        pg:     'select * from table where not (a is null or b between $1 and $2)',
        mysql:  'select * from table where not (a is null or b between ? and ?)',
        mssql:  'select * from table where not (a is null or b between ? and ?)',
        sqlite: 'select * from table where not (a is null or b between ? and ?)',
      },
      [10, 20]
    )
    
    support.test(
      "accepts sub queries",
      qb.selectFrom('table').where(IN('key', qb.select('id').from('foo').where('status', 'active'))),
      {
        pg:     'select * from table where key in (select id from foo where status = $1)',
        mysql:  'select * from table where key in (select id from foo where status = ?)',
        mssql:  'select * from table where key in (select id from foo where status = ?)',
        sqlite: 'select * from table where key in (select id from foo where status = ?)',
      },
      ['active']
    )
    
    support.test(
      "accepts exists conditions",
      qb.selectFrom('table').where(EXISTS(qb.select('id').from('foo').where('status', 'active'))),
      {
        pg:     'select * from table where exists (select id from foo where status = $1)',
        mysql:  'select * from table where exists (select id from foo where status = ?)',
        mssql:  'select * from table where exists (select id from foo where status = ?)',
        sqlite: 'select * from table where exists (select id from foo where status = ?)',
      },
      ['active']
    )
    
  })

  describe("test orderBy():", () => {
    
    support.test(
      "adds columns to sort with",
      qb.select().from('table').orderBy(1, 'col1', 'col2 desc'),
      {
        pg:     'select * from table order by 1, col1, col2 desc',
        mysql:  'select * from table order by 1, col1, col2 desc',
        mssql:  'select * from table order by 1, col1, col2 desc',
        sqlite: 'select * from table order by 1, col1, col2 desc',
      }
    )
    
    support.test(
      "appends more orders when called multiple times",
      qb.select().from('table').orderBy(1).orderBy('col1').orderBy('col2 desc'),
      {
        pg:     'select * from table order by 1, col1, col2 desc',
        mysql:  'select * from table order by 1, col1, col2 desc',
        mssql:  'select * from table order by 1, col1, col2 desc',
        sqlite: 'select * from table order by 1, col1, col2 desc',
      }
    )
    
    support.test(
      "accepts order expressions",
      qb.select().from(T('table')).orderBy(C('col1').asc(), C('col2').desc()),
      {
        pg:     'select * from "table" order by "col1" asc, "col2" desc',
        mysql:  'select * from `table` order by `col1` asc, `col2` desc',
        mssql:  'select * from [table] order by [col1] asc, [col2] desc',
        sqlite: 'select * from "table" order by "col1" asc, "col2" desc',
      }
    )
    
  })

  describe("test limit() and offset():", () => {
    
    support.test(
      "adds only the limit clause",
      qb.select().from('table').limit(5),
      {
        pg:     'select * from table limit $1',
        mysql:  'select * from table limit ?',
        mssql:  'select top(?) * from table',
        sqlite: 'select * from table limit ?',
      },
      [5]
    )
    
    support.test(
      "adds a numeric offset only",
      qb.selectFrom('table').offset(30),
      {
        pg:     'select * from table offset $1',
        mysql:  'select * from table limit 18446744073709551615 offset ?',
        mssql:  'select * from table order by (select 0) offset ? rows',
        sqlite: 'select * from table limit -1 offset ?',
      },
      [30]
    )
    
    support.test(
      "adds both offset and limit clauses",
      qb.selectFrom('table').limit(3).offset(6).orderBy('pk'),
      {
        pg:     'select * from table order by pk limit $1 offset $2',
        mysql:  'select * from table order by pk limit ? offset ?',
        sqlite: 'select * from table order by pk limit ? offset ?',
        mssql:  {
          sql: 'select * from table order by pk offset ? rows fetch next ? rows only',
          params: [6, 3]
        },
      },
      [3, 6]
    )
    
  })
  
  describe("test groupBy():", () => {
    
    support.test(
      "adds group by columns",
      qb.select().from('table').groupBy('col1', C('col2')),
      {
        pg:     'select * from table group by col1, "col2"',
        mysql:  'select * from table group by col1, `col2`',
        mssql:  'select * from table group by col1, [col2]',
        sqlite: 'select * from table group by col1, "col2"',
      }
    )
    
    support.test(
      "appends more groups when called multiple times",
      qb.select().from('table').groupBy('col1').groupBy(C('col2')),
      {
        pg:     'select * from table group by col1, "col2"',
        mysql:  'select * from table group by col1, `col2`',
        mssql:  'select * from table group by col1, [col2]',
        sqlite: 'select * from table group by col1, "col2"',
      }
    )
    
  })
  
  describe("test having():", () => {
    
    support.test(
      "adds a basic having condition",
      qb.select('name', COUNT()).from('table').groupBy('name').having(COUNT(), '>', 5),
      {
        pg:     'select name, count(*) from table group by name having count(*) > $1',
        mysql:  'select name, count(*) from table group by name having count(*) > ?',
        mssql:  'select name, count(*) from table group by name having count(*) > ?',
        sqlite: 'select name, count(*) from table group by name having count(*) > ?',
      },
      [5]
    )
    
    support.test(
      "adds a raw having condition",
      qb.select('name', COUNT().as('count')).from('table').groupBy('name').having(RAW`count > ${5}`),
      {
        pg:     'select name, count(*) as "count" from table group by name having count > $1',
        mysql:  'select name, count(*) as `count` from table group by name having count > ?',
        mssql:  'select name, count(*) as [count] from table group by name having count > ?',
        sqlite: 'select name, count(*) as "count" from table group by name having count > ?',
      },
      [5]
    )
    
    support.test(
      "adds a complex having condition",
      qb.select('name', MIN("age"), SUM('wallet')).from('guys').groupBy('name').havingNot(MIN('age'), 'between', [14, 21]).orHaving('sum(wallet)', [300, 400, 500]),
      {
        pg:     'select name, min(age), sum(wallet) from guys group by name having min(age) not between $1 and $2 or sum(wallet) in ($3, $4, $5)',
        mysql:  'select name, min(age), sum(wallet) from guys group by name having min(age) not between ? and ? or sum(wallet) in (?, ?, ?)',
        mssql:  'select name, min(age), sum(wallet) from guys group by name having min(age) not between ? and ? or sum(wallet) in (?, ?, ?)',
        sqlite: 'select name, min(age), sum(wallet) from guys group by name having min(age) not between ? and ? or sum(wallet) in (?, ?, ?)',
      },
      [14, 21, 300, 400, 500]
    )
    
  })
  
  describe("test clone():", () => {
    
    it("returns an instance of Select query", () => {
      assert.ok(qb.select().clone() instanceof Select)
    })
    
  })
  
})