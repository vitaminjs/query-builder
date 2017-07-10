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

    support.test(
      'accepts literal expressions',
      qb.select(123, true, null),
      {
        pg: 'select 123, true, null',
        mysql: 'select 123, true, null from dual',
        mssql: 'select 123, true, null',
        sqlite: 'select 123, true, null'
      }
    )
  })
})
