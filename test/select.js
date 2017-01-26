/* global describe */

var RAW = require('../lib/helpers').RAW
var Builder = require('../lib/index')
var support = require('./support')
var qb = () => new Builder()

describe("test building select queries:", () => {
  
  describe("test select():", () => {
    
    support.test("returns empty string for empty queries", qb().select(), {
      mysql: '',
      mssql: '',
      sqlite: '',
      oracle: '',
      postgre: '',
    })
    
    support.test("accepts literal numbers", qb().select(1), {
      mysql: 'select 1',
      mssql: 'select 1',
      sqlite: 'select 1',
      oracle: 'select 1',
      postgre: 'select 1',
    })
    
    support.test("accepts literal booleans", qb().select(false), {
      mysql: 'select 0',
      mssql: 'select 0',
      sqlite: 'select 0',
      oracle: 'select 0',
      postgre: 'select 0',
    })
    
    support.test("accepts literal strings", qb().select("xXx"), {
      mysql: 'select xXx',
      mssql: 'select xXx',
      sqlite: 'select xXx',
      oracle: 'select xXx',
      postgre: 'select xXx',
    })
    
    support.test("accepts raw expressions", qb().select(RAW('1 + ? as "operation"', 2)), {
      mysql: 'select 1 + ? as "operation"',
      mssql: 'select 1 + @1 as "operation"',
      sqlite: 'select 1 + $1 as "operation"',
      oracle: 'select 1 + :1 as "operation"',
      postgre: 'select 1 + $1 as "operation"',
    }, [2])
    
  })
  
})