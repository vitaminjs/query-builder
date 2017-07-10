/* global describe */

var qb = require('../lib')
var support = require('./support')

describe('test building select queries:', () => {
  describe('test select():', () => {
    support.test(
      'returns empty string for empty queries',
      qb.select(),
      {
        pg: '',
        mysql: '',
        mssql: '',
        sqlite: ''
      }
    )
  })
})
