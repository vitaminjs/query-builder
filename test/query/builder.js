/* global it */
/* global describe */
/* global beforeEach */

var RAW = require('../../lib/helpers').RAW
var SQ = require('../../lib/helpers').SQ
var Builder = require('../../lib/index')
var assert = require('assert')
var qb = () => new Builder()

function compile(qb, dialect) {
  return qb.compile(dialect || 'standard')
}

describe("test the query builder:", () => {
  
  describe("test building a select query:", () => {
    
    it("returns empty string for empty query", () => {
      var q = compile(qb())
      
      assert.equal(q.sql, "")
      assert.deepEqual(q.values, [])
    })
    
    it("returns a basic select query", () => {
      var q = compile(qb().select().from("table"))
      
      assert.equal(q.sql, 'select * from "table"')
      assert.deepEqual(q.values, [])
    })
    
    it("returns a distinct select query", () => {
      var q = compile(qb().select().distinct().from('table'))
      
      assert.equal(q.sql, 'select distinct * from "table"')
      assert.deepEqual(q.values, [])
    })
    
    describe("test select():", () => {
      
      it("adds columns to the select clause", () => {
        var builder = qb().select('t.foo', 'bar as baz').from('table as t')
        var q = compile(builder)
        
        assert.equal(q.sql, 'select "t"."foo", "bar" as "baz" from "table" as "t"')
        assert.equal(builder.columns.length, 2)
        assert.deepEqual(q.values, [])
      })
      
      it("accepts raw expression", () => {
        var Expr = require('../../lib/expression').Raw
        var builder = qb().select(RAW('1 + ? as operation', 5))
        var q = compile(builder)
        
        assert.equal(q.sql, 'select 1 + ? as operation')
        assert.ok(builder.columns[0] instanceof Expr)
        assert.equal(q.values.length, 1)
        assert.deepEqual(q.values, [5])
      })
      
      it("accepts aggregates", () => {
        var COUNT = require('../../lib/helpers').COUNT
        var MAX = require('../../lib/helpers').MAX
        var SUM = require('../../lib/helpers').SUM
        
        // use distinct count
        var q1 = compile(qb().select(COUNT('column').as('count').distinct()).from('table'))
        
        assert.equal(q1.sql, 'select count(distinct "column") as "count" from "table"')
        
        // use max and sum
        var q2 = compile(qb().select(SUM('price').as('total')).select(MAX('income')).from('orders'))
        
        assert.equal(q2.sql, 'select sum("price") as "total", max("income") from "orders"')
      })
      
      it("accepts sub queries", () => {
        // use strings
        var q1 = compile(qb().select(SQ('select count(*) from table')))
        
        assert.equal(q1.sql, 'select (select count(*) from table)')
        
        // use functions
        var fn = builder => {
          assert.ok(builder instanceof Builder)
          
          return builder.select('col').from('another_table')
        }
        
        var q2 = compile(qb().select('table.*').select(SQ(fn).as('column')).from('table'))
        
        assert.equal(q2.sql, 'select "table".*, (select "col" from "another_table") as "column" from "table"')
      })
      
    })
    
    describe("test from():", () => {
      
      it("escapes properly the table aliases", () => {
        var q = compile(qb().from('table as t'))
        
        assert.equal(q.sql, 'select * from "table" as "t"')
        assert.deepEqual(q.values, [])
      })
      
      it("escapes properly the table's schema", () => {
        var q = compile(qb().from('schema.table as t'))
        
        assert.equal(q.sql, 'select * from "schema"."table" as "t"')
        assert.deepEqual(q.values, [])
      })
      
      it("accepts more than one table for `from` clause", () => {
        var q = compile(qb().from('table1').from('t2 as table2'))
        
        assert.equal(q.sql, 'select * from "table1", "t2" as "table2"')
        assert.deepEqual(q.values, [])
      })
      
      it("accepts raw expressions", () => {
        var q = compile(qb().from(RAW('schema.table t')))
        
        assert.equal(q.sql, 'select * from schema.table t')
      })
      
      it("accepts sub queries", () => {
        var fn = builder => {
          assert.ok(builder instanceof Builder)
          
          return builder.select('*').from('another_table')
        }
        
        var q = compile(qb().from('t1').from(SQ(fn).as('t2')))
        
        assert.equal(q.sql, 'select * from "t1", (select * from "another_table") as "t2"')
      })
      
    })
    
  })

  
})
