/* global it */

var createCompiler = require('../lib/compiler/index').createCompiler
var assert = require('assert')

/**
 * 
 * @param {String} purpose
 * @param {Any} compilable
 * @param {Object} dialects
 * @param {Array} params
 */
exports.test = function test(purpose, compilable, dialects, params) {
  Object.keys(dialects).forEach(name => {
    it(name +': '+ purpose, () => {
      var compiler = createCompiler(name)
      var sql = compilable.compile(compiler)
      var expected = dialects[name]
      
      assert.equal(sql, expected.sql || expected)
      assert.deepEqual(compiler.getBindings(), expected.params || params || [])
    })
  })
}

/**
 * 
 * @param {String} purpose
 */
exports.skip = function skip(purpose) {
  it.skip(purpose)
}