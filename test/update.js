/* global describe */

var support = require('./support')
var raw = require('../lib/helpers').raw
var qb = require('../lib/builder').factory

describe('test building update queries:', () => {
  support.test(
    'returns empty string if the values are missing',
    qb('any_table').update(),
    {
      pg: '',
      mysql: '',
      mssql: '',
      sqlite: ''
    }
  )

  support.test(
    'generates a basic update query using plain object data',
    qb('users').update({'email': 'foo', 'name': 'bar'}),
    {
      pg: 'update "users" set "email" = $1, "name" = $2',
      mysql: 'update `users` set `email` = ?, `name` = ?',
      mssql: 'update [users] set [email] = ?, [name] = ?',
      sqlite: 'update "users" set "email" = ?, "name" = ?'
    },
    [
      'foo',
      'bar'
    ]
  )

  support.test(
    'generates a basic update query using plain object data and conditions',
    qb('books').update({ status: 'archived' }).where('publish_date <= ?', 2000),
    {
      pg: 'update "books" set "status" = $1 where publish_date <= $2',
      mysql: 'update `books` set `status` = ? where publish_date <= ?',
      mssql: 'update [books] set [status] = ? where publish_date <= ?',
      sqlite: 'update "books" set "status" = ? where publish_date <= ?'
    },
    [
      'archived',
      2000
    ]
  )

  support.test(
    'generates a basic update query using key/value format',
    qb('books').update({'status': 'archived'}),
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
    'allows undefined values for columns',
    qb('users').update({ 'email': 'foo', 'name': undefined }).where('id = ?', 1),
    {
      pg: 'update "users" set "email" = $1, "name" = default where id = $2',
      mysql: 'update `users` set `email` = ?, `name` = default where id = ?',
      mssql: 'update [users] set [email] = ?, [name] = default where id = ?',
      sqlite: 'update "users" set "email" = ?, "name" = null where id = ?'
    },
    [
      'foo',
      1
    ]
  )

  support.test(
    'allows null values for columns',
    qb('t').update({ 'a': 'xyz', 'b': null }).where('1 = 1'),
    {
      pg: 'update "t" set "a" = $1, "b" = $2 where 1 = 1',
      mysql: 'update `t` set `a` = ?, `b` = ? where 1 = 1',
      mssql: 'update [t] set [a] = ?, [b] = ? where 1 = 1',
      sqlite: 'update "t" set "a" = ?, "b" = ? where 1 = 1'
    },
    [ 'xyz', null ]
  )

  support.test(
    'allows sub queries as column value',
    qb('players').update({'level': qb().select('max(level)').from('levels')}).where('id = ?', 123),
    {
      pg: 'update "players" set "level" = (select max(level) from "levels") where id = $1',
      mysql: 'update `players` set `level` = (select max(level) from `levels`) where id = ?',
      mssql: 'update [players] set [level] = (select max(level) from [levels]) where id = ?',
      sqlite: 'update "players" set "level" = (select max(level) from "levels") where id = ?'
    },
    [
      123
    ]
  )

  support.test(
    'adds a returning clause',
    qb('foo').update({'a': raw(`a + 1`)}).where('a > ?', 3).returning('*'),
    {
      pg: 'update "foo" set "a" = a + 1 where a > $1 returning *',
      mssql: 'update [foo] set [a] = a + 1 output inserted.* where a > ?'
    },
    [
      3
    ]
  )
})
