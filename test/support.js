/* global it */

var assert = require('assert')
var createCompiler = require('../lib/compiler').createCompiler

var options = {
  autoQuoteIdentifiers: true
}

/**
 * @param {String} purpose
 * @param {Expression} expr
 * @param {Object} dialects
 * @param {Array} params
 */
exports.test = function test (purpose, expr, dialects, params) {
  Object.keys(dialects).forEach(name => {
    it(name + ': ' + purpose, () => {
      var compiler = createCompiler(name, options)
      var result = compiler.build(expr)
      var expected = dialects[name]

      assert.equal(result.sql, expected.sql || expected)
      assert.deepEqual(result.params, expected.params || params || [])
    })
  })
}

/**
 * @param {String} purpose
 */
exports.skip = function skip (purpose) {
  it.skip(purpose)
}
