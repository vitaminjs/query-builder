/* global it */

var assert = require('assert')
var Builder = require('../../lib/builder').default
var createCompiler = require('../../lib/compiler/factory').default

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
      var query
      var expected = dialects[name]

      if (expr instanceof Builder) query = expr.toQuery(name, options)
      else query = createCompiler(name, options).toQuery(expr)

      assert.equal(query.sql, expected.sql || expected)
      assert.deepEqual(query.params, expected.params || params || [])
    })
  })
}

/**
 * @param {String} purpose
 */
exports.skip = function skip (purpose) {
  it.skip(purpose)
}
