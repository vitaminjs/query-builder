/* global it */
/* global assert */
/* global describe */
/* global beforeEach */

var BaseCompiler = require('../../../lib/compiler/base')

describe("BaseCompiler tests", function () {
  
  var compiler
  
  beforeEach(function () {
    compiler = new BaseCompiler()
  })
  
  describe("escapeId()", function () {
    
    it("escapes correctly an identifier", function () {
      assert.equal(compiler.escapeId('*'), '*')
      assert.equal(compiler.escapeId('foo'), '"foo"')
    })
    
  })
  
  describe("escape()", function () {
    
    it("escapes column or table names", function () {
      // TODO mock compiler.escapeId()
      assert.equal(compiler.escape('foo'), '"foo"')
      assert.equal(compiler.escape('foo.*'), '"foo".*')
      assert.equal(compiler.escape('foo.bar'), '"foo"."bar"')
      
      // TODO mock compiler.alias()
      assert.equal(compiler.escape('foo as bar'), '"foo" as "bar"')
    })
    
  })
  
  describe("columnize()", function () {
    
    it("returns a string of the columns separated by a comma", function() {
      // TODO mock compiler.escape()
      assert.equal(compiler.columnize([]), '*')
      assert.equal(compiler.columnize(['foo', 'bar']), 'foo, bar')
    })
  })
  
  describe("alias()", function () {
    
    it("", function () {
      // TODO mock `compiler.escapeId()`
      assert.equal(compiler.alias('foo'), 'foo')
      assert.equal(compiler.alias('foo', null), 'foo')
      assert.equal(compiler.alias('foo', 'bar'), 'foo as bar')
      assert.equal(compiler.alias('foo as bar'), 'foo as bar')
    })
  })
  
  describe("parameter()", function () {
    
    it("adds string parameters", function () {
      // TODO spy on compiler.addBinding(v) => `v` is string
      assert.equal(compiler.paramter(''), '?')
      assert.equal(compiler.paramter('foo'), '?')
      assert.equal(compiler.paramter(['foo', 'bar']), '?, ?')
    })
    
    it("adds numeric parameters", function () {
      // TODO spy on compiler.addBinding(v) => `v` is number
      assert.equal(compiler.paramter(123), '?')
      assert.equal(compiler.paramter(12.3), '?')
    })
    
    it("throws a TypeError for invalid parameters", function () {
      assert.throw(compiler.parameter([]), TypeError)
    })
    
  })
  
  describe("addBinding()", function () {
    
    it("adds query binding values", function () {
      compiler.addBinding(String|Number|Boolean|Array)
      assert.equal(compiler.bindings[0], 'foo')
    })
    
    it("adds boolean bindings", function () {
      // TODO spy on compiler.addBinding() that receive a interger
      assert.equal(compiler.parameter(false), '?')
    })
    
    it("throws a TypeError for invalid values", function () {
      assert.throw(compiler.parameter({}), TypeError)
      assert.throw(compiler.parameter(undefined), TypeError)
    })
    
  })
  
  describe("compileSelect()", function () {
    
    it("returns an empty if no table and columns defined", function () {
      assert.equal(compiler.compileSelect( {} ), '')
    })
    
    // it("compiles a standard select query", function () {
    //   // 
    //   assert.equal(compiler.compileSelect({ tables: ['foo'] }), 'select * from foo')
    // })
    
  })
  
  describe("compileColumns()", function () {
    
    it("returns '*' as default value", function () {
      // TODO mock compiler.columnize() to return '*' string
      assert.equal(compiler.compileColumns({ columns: [] }), '*')
    })
    
    it("returns the columns list separated by a comma", function () {
      // TODO mock compiler.columnize() to return 'foo, bar' string
      assert.equal(compiler.compileColumns({ columns: ['foo', 'bar'] }), 'foo, bar')
    })
    
  })
  
})