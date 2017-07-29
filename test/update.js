/* global describe */

var support = require('./support')
var { table, raw, select } = require('../dist')

describe('test building update queries:', () => {
  support.test(
    'returns empty string if the values are missing',
    table('any_table').update(),
    {
      pg: '',
      mysql: '',
      mssql: '',
      sqlite: ''
    }
  )

  support.test(
    'generates a basic update query using plain object data',
    table('books').update({ status: 'archived' }),
    {
      pg: 'update "books" set "status" = $1',
      mysql: 'update `books` set `status` = ?',
      mssql: 'update [books] set [status] = ?',
      sqlite: 'update "books" set "status" = ?'
    },
    [
      'archived'
    ]
  )

  support.test(
    'generates a basic update query using plain object data and conditions',
    table('books').update({ status: 'archived' }).where('publish_date <= ?', 2000),
    {
      pg: 'update "books" set "status" = $1 where publish_date <= $2',
      mysql: 'update `books` set `status` = ? where publish_date <= ?',
      mssql: 'update [books] set [status] = ? where publish_date <= ?',
      sqlite: 'update "books" set "status" = ? where publish_date <= ?'
    },
    ['archived', 2000]
  )

  support.test(
    'generates a basic update query using key/value format',
    table('books').update('status', 'archived'),
    {
      pg: 'update "books" set "status" = $1',
      mysql: 'update `books` set `status` = ?',
      mssql: 'update [books] set [status] = ?',
      sqlite: 'update "books" set "status" = ?'
    },
    [
      'archived'
    ]
  )

  support.test(
    'generates a basic update query using key/value format and conditions',
    table('books').update('status', 'archived').where(`publish_date < ?`, 2000),
    {
      pg: 'update "books" set "status" = $1 where publish_date < $2',
      mysql: 'update `books` set `status` = ? where publish_date < ?',
      mssql: 'update [books] set [status] = ? where publish_date < ?',
      sqlite: 'update "books" set "status" = ? where publish_date < ?'
    },
    [
      'archived',
      2000
    ]
  )

  support.test(
    'adds more values for multiple call of set',
    table('t').update().set('a', 'xyz').set('b', null).set('c', undefined),
    {
      pg: 'update "t" set "a" = $1, "b" = $2, "c" = default',
      mysql: 'update `t` set `a` = ?, `b` = ?, `c` = default',
      mssql: 'update [t] set [a] = ?, [b] = ?, [c] = default',
      sqlite: 'update "t" set "a" = ?, "b" = ?, "c" = null'
    },
    [ 'xyz', null ]
  )

  support.test(
    'generates an update query using a sub query',
    table('players').update('level', select('max(level)').from('levels')).where('id = ?', 123),
    {
      pg: 'update "players" set "level" = (select max(level) from levels) where id = $1',
      mysql: 'update `players` set `level` = (select max(level) from levels) where id = ?',
      mssql: 'update [players] set [level] = (select max(level) from levels) where id = ?',
      sqlite: 'update "players" set "level" = (select max(level) from levels) where id = ?'
    },
    [
      123
    ]
  )

  support.test(
    'adds a returning clause',
    table('foo').update('a', raw(`a + 1`)).where('a > ?', 3).returning('*'),
    {
      pg: 'update "foo" set "a" = a + 1 where a > $1 returning *',
      mssql: 'update [foo] set [a] = a + 1 output inserted.* where a > ?'
    },
    [
      3
    ]
  )
})
