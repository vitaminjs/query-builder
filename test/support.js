/* global it */

var assert = require('assert')
var createCompiler = require('../lib/compiler').createCompiler

/**
 * @param {String} purpose
 * @param {Expression} expr
 * @param {Object} dialects
 * @param {Array} params
 */
exports.test = function test (purpose, expr, dialects, params) {
  Object.keys(dialects).forEach(name => {
    it(name + ': ' + purpose, () => {
      var result = createCompiler(name).build(expr)
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
