/* global it */

var assert = require('assert')

/**
 * 
 * @param {String} purpose
 * @param {Builder} qb
 * @param {Objects} dialects
 * @param {Array} params
 */
exports.test = function test(purpose, qb, dialects, params) {
  Object.keys(dialects).forEach(name => {
    it(name +': it '+ purpose, () => {
      var q = qb.toSQL(name)
      var expected = dialects[name]
      
      assert.equal(q.sql, expected.sql || expected)
      assert.deepEqual(q.params, expected.params || params || [])
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