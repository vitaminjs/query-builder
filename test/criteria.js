/* global describe */

var Criteria = require('../lib/criterion/criteria').default
var support = require('./support')
var __ = require('../lib')

function where() {
  return (cr = new Criteria()).where.apply(cr, arguments)
}

describe("test Criteria object:", () => {
  
  support.test(
    "using booleans",
    where(true).whereNot(true),
    {
      pg: '1 = 1 and 1 = 0',
      mysql: '1 = 1 and 1 = 0',
      mssql:  '1 = 1 and 1 = 0',
      sqlite: '1 = 1 and 1 = 0',
    },
    []
  )
  
  support.test(
    "using simple value",
    where('foo', 123).orWhere('bar', 'baz'),
    {
      pg: 'foo = $1 or bar = $2',
      mysql: 'foo = ? or bar = ?',
      mssql:  'foo = ? or bar = ?',
      sqlite: 'foo = ? or bar = ?',
    },
    [ 123, 'baz' ]
  )
  
  support.test(
    "using a criterion instance as value",
    where('foo', __.eq(123)),
    {
      pg: 'foo = $1',
      mysql: 'foo = ?',
      mssql:  'foo = ?',
      sqlite: 'foo = ?',
    },
    [ 123 ]
  )
  
  support.test(
    "using null values",
    where('foo', null),
    {
      pg: 'foo is null',
      mysql: 'foo is null',
      mssql:  'foo is null',
      sqlite: 'foo is null',
    },
    []
  )
  
  support.test(
    "using plain objects",
    where({ foo: 123, bar: 'baz' }),
    {
      pg: '(foo = $1 and bar = $2)',
      mysql: '(foo = ? and bar = ?)',
      mssql:  '(foo = ? and bar = ?)',
      sqlite: '(foo = ? and bar = ?)',
    },
    [ 123, 'baz' ]
  )
  
  support.test(
    "using `or` helper and plain objects",
    where(__.or({ foo: 123, bar: 'baz' })),
    {
      pg: '(foo = $1 or bar = $2)',
      mysql: '(foo = ? or bar = ?)',
      mssql:  '(foo = ? or bar = ?)',
      sqlite: '(foo = ? or bar = ?)',
    },
    [ 123, 'baz' ]
  )
  
  support.test(
    "using functions",
    where(cr => cr.where('foo', 123).orWhereNot('bar', null)),
    {
      pg: '(foo = $1 or bar is not null)',
      mysql: '(foo = ? or bar is not null)',
      mssql:  '(foo = ? or bar is not null)',
      sqlite: '(foo = ? or bar is not null)',
    },
    [ 123 ]
  )
  
  support.test(
    "using Criterion instances",
    where(__.gt('foo', 123)).whereNot(__.lte('bar', 456)),
    {
      pg: 'foo > $1 and bar > $2',
      mysql: 'foo > ? and bar > ?',
      mssql:  'foo > ? and bar > ?',
      sqlite: 'foo > ? and bar > ?',
    },
    [ 123, 456 ]
  )
  
  support.test(
    "using an array of values",
    where('foo', [1, 2, 3]),
    {
      pg: 'foo in ($1, $2, $3)',
      mysql: 'foo in (?, ?, ?)',
      mssql:  'foo in (?, ?, ?)',
      sqlite: 'foo in (?, ?, ?)',
    },
    [ 1, 2, 3 ]
  )
  
  support.test(
    "using sub queries",
    where('foo', __.sq('select field from table')),
    {
      pg: 'foo = (select field from table)',
      mysql: 'foo = (select field from table)',
      mssql:  'foo = (select field from table)',
      sqlite: 'foo = (select field from table)',
    },
    []
  )
  
  support.test(
    "using sub queries and in operator",
    where('foo', __.in('select field from table')),
    {
      pg: 'foo in (select field from table)',
      mysql: 'foo in (select field from table)',
      mssql:  'foo in (select field from table)',
      sqlite: 'foo in (select field from table)',
    },
    []
  )
  
  support.test(
    "using `in` and `not` together",
    where('foo', __.not(__.in([ 1, 2, 3 ]))),
    {
      pg: 'foo not in ($1, $2, $3)',
      mysql: 'foo not in (?, ?, ?)',
      mssql:  'foo not in (?, ?, ?)',
      sqlite: 'foo not in (?, ?, ?)',
    },
    [ 1, 2, 3 ]
  )
  
  support.test(
    "using raw expressions",
    where(__.raw('a = ? and (b > ? or c in ?)', 123, 200, [4, 5])),
    {
      pg: 'a = $1 and (b > $2 or c in ($3, $4))',
      mysql: 'a = ? and (b > ? or c in (?, ?))',
      mssql:  'a = ? and (b > ? or c in (?, ?))',
      sqlite: 'a = ? and (b > ? or c in (?, ?))',
    },
    [ 123, 200, 4, 5 ]
  )
  
  support.test(
    "using negated raw expressions (case 2)",
    where(true).orWhereNot(__.raw('a = ? and (b > ? or c in ?)', 123, 200, [4, 5])),
    {
      pg: '1 = 1 or not (a = $1 and (b > $2 or c in ($3, $4)))',
      mysql: '1 = 1 or not (a = ? and (b > ? or c in (?, ?)))',
      mssql:  '1 = 1 or not (a = ? and (b > ? or c in (?, ?)))',
      sqlite: '1 = 1 or not (a = ? and (b > ? or c in (?, ?)))',
    },
    [ 123, 200, 4, 5 ]
  )
  
  support.test(
    "using an expression as operand instead of a plain string",
    where(__.column('a'), false),
    {
      pg: '"a" = $1',
      mysql: '`a` = ?',
      mssql:  '[a] = ?',
      sqlite: '"a" = ?',
    },
    [ false ]
  )
  
})