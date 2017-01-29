/* global describe */

var fn = require('../../lib/helpers')
var qb = require('../../lib/index')
var support = require('./support')
var COUNT = fn.COUNT
var RAW   = fn.RAW
var MAX   = fn.MAX
var SQ    = fn.SQ
var C     = fn.C

describe("test building select queries:", () => {
  
  describe("test select():", () => {
    
    support.test("returns empty string for empty queries", qb.select(), {
      pg:     '',
      mysql:  '',
      mssql:  '',
      sqlite: '',
      oracle: '',
    })
    
    support.test("accepts literal expressions", qb.select(1, false, 'xXx'), {
      pg:     'select 1, 0, xXx',
      mysql:  'select 1, 0, xXx from dual',
      mssql:  'select 1, 0, xXx',
      sqlite: 'select 1, 0, xXx',
      oracle: 'select 1, 0, xXx from dual',
    })
    
    support.test("accepts raw expressions", qb.select(RAW('1 + ?', 2).as('operation')), {
      pg:     'select (1 + $1) as "operation"',
      mysql:  'select (1 + ?) as `operation` from dual',
      mssql:  'select (1 + @1) as [operation]',
      sqlite: 'select (1 + $1) as "operation"',
      oracle: 'select (1 + :1) "operation" from dual',
    }, [2])
    
    support.test("accepts aggregates", qb.select(COUNT('foo').distinct().as('foo_count')), {
      pg:     'select count(distinct foo) as "foo_count"',
      mysql:  'select count(distinct foo) as `foo_count` from dual',
      mssql:  'select count(distinct foo) as [foo_count]',
      sqlite: 'select count(distinct foo) as "foo_count"',
      oracle: 'select count(distinct foo) "foo_count" from dual',
    })
    
    support.test("accepts sub queries", qb.select(SQ('select count(*) from table').as('column')), {
      pg:     'select (select count(*) from table) as "column"',
      mysql:  'select (select count(*) from table) as `column` from dual',
      mssql:  'select (select count(*) from table) as [column]',
      sqlite: 'select (select count(*) from table) as "column"',
      oracle: 'select (select count(*) from table) "column" from dual',
    })

    support.test("accepts column expressions", qb.select(C('foo').as('bar'), MAX(C('baz')).as('dummy')), {
      pg:     'select "foo" as "bar", max("baz") as "dummy"',
      mysql:  'select `foo` as `bar`, max(`baz`) as `dummy` from dual',
      mssql:  'select [foo] as [bar], max([baz]) as [dummy]',
      sqlite: 'select "foo" as "bar", max("baz") as "dummy"',
      oracle: 'select "foo" "bar", max("baz") "dummy" from dual',
    })
    
  })
  
})