/* global describe */

var Builder = require('../lib/index')
var fn = require('../lib/helpers')
var support = require('./support')
var qb = () => new Builder()
var RAW = fn.RAW
var COUNT = fn.COUNT

describe("test building select queries:", () => {
  
  describe("test select():", () => {
    
    support.test("returns empty string for empty queries", qb().select(), {
      mysql: '',
      mssql: '',
      sqlite: '',
      oracle: '',
      postgre: '',
    })
    
    support.test("accepts literal expressions", qb().select(1, false, 'xXx'), {
      mysql: 'select 1, 0, xXx',
      mssql: 'select 1, 0, xXx',
      sqlite: 'select 1, 0, xXx',
      oracle: 'select 1, 0, xXx',
      postgre: 'select 1, 0, xXx',
    })
    
    support.test("accepts raw expressions", qb().select(RAW('1 + ? as "operation"', 2)), {
      mysql: 'select 1 + ? as "operation"',
      mssql: 'select 1 + @1 as "operation"',
      sqlite: 'select 1 + $1 as "operation"',
      oracle: 'select 1 + :1 as "operation"',
      postgre: 'select 1 + $1 as "operation"',
    }, [2])
    
    support.test("accepts aggregates", qb().select(COUNT('foo').as('foo_count')), {
      mysql: 'select count(foo) as `foo_count`',
      mssql: 'select count(foo) as [foo_count]',
      sqlite: 'select count(foo) as "foo_count"',
      oracle: 'select count(foo) "foo_count"',
      postgre: 'select count(foo) as "foo_count"',
    })
    
  })
  
})