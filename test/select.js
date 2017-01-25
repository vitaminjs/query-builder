/* global describe */

var Builder = require('../lib/index')
var assert = require('assert')
var qb = () => new Builder()

describe("test building select queries:", () => {
  
  describe("test select():", () => {
    // qb().select() => ''
    // qb().select(1) => 'select 1'
    // qb().select(false) => 'select 0'
    // qb().select("1 + 1") => 'select 1 + 1'
  })
  
})