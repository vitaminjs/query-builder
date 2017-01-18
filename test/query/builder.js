/* global it, describe, beforeEach */

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
        var q = compile(qb().select(RAW('1 + ? as operation', 5)))
        
        assert.equal(q.sql, 'select 1 + ? as operation')
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

    describe("test limit() and offset():", () => {
      
      it("adds the limit clause", () => {
        var q = compile(qb().from('table').limit(15))

        assert.equal(q.sql, 'select * from "table" limit ?')
        assert.equal(q.values.length, 1)
        assert.equal(q.values[0], 15)
      })

      it("adds the offset clause", () => {
        var q = compile(qb().from('table').offset(30))

        assert.equal(q.sql, 'select * from "table" offset ?')
        assert.equal(q.values.length, 1)
        assert.equal(q.values[0], 30)
      })

      it("adds both offset and limit clauses", () => {
        var q = compile(qb().from('table').offset(30).limit(15))

        assert.equal(q.sql, 'select * from "table" limit ? offset ?')
        assert.equal(q.values.length, 2)
        assert.equal(q.values[0], 30)
        assert.equal(q.values[1], 15)
      })

    })

    describe("test orderBy():", () => {

      it("adds columns to order with", () => {
        var q = compile(qb().from('table').orderBy('col1', 'col2'))

        assert.equal(q.sql, 'select * from "table" order by "col1" asc, "col2" asc')
      })

      it("adds descending order columns", () => {
        var q = compile(qb().from('table').orderBy('col1', '-col2'))

        assert.equal(q.sql, 'select * from "table" order by "col1" asc, "col2" desc')
      })

    })

    describe("test where():", () => {})

    describe("test join():", () => {

      it("adds a basic join clause", () => {
        var q = compile(qb().from('posts as p').join('users as author', 'p.author_id', 'author.id'))

        assert.equal(q.sql, 'select * from "posts" as "p" inner join "users" as "author" on "p"."author_id" = "author"."id"')
      })

      it("adds a table join with more than 1 condition", () => {
        var fn = cr => {
          cr.on('p.salary', '>=', 'c.min_salary').on('p.salary', '<=', 'c.max_salary')
        }

        var q = compile(qb().from('people as p').join('category as c', fn))

        assert.equal(q.sql, 'select * from "people" as "p" inner join "category" as "c" on ("p"."salary" >= "c"."min_salary" and "p"."salary" <= "c"."max_salary")')
      })

      it("adds a join with a sub query", () => {
        var fn = builder => {
          builder.from('table2')
        }

        var q = compile(qb().from('table1 as t1').crossJoin(SQ(fn).as('t2')))

        assert.equal(q.sql, 'select * from "table1" as "t1" cross join (select * from "table2") as "t2"')
      })

      it("adds a raw join expression", () => {
        var q = compile(qb().from('table1').join(RAW('natural full join table2')))

        assert.equal(q.sql, 'select * from "table1" natural full join table2')
      })

    })

    describe("test union():", () => {})
    
  })

})
