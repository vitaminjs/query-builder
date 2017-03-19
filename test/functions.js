/* global describe */

var support = require('./support')
var __      = require('../lib')

describe("test SQL functions:", () => {
  
  support.test(
    "test upper()",
    __.upper(__.esc('foo')),
    {
      pg:     "upper('foo')",
      mysql:  "upper('foo')",
      mssql:  "upper('foo')",
      sqlite: "upper('foo')",
    }
  )
  
  support.test(
    "test lower()",
    __.lower(__.column('bar')),
    {
      pg:     'lower("bar")',
      mysql:  'lower(`bar`)',
      mssql:  'lower([bar])',
      sqlite: 'lower("bar")',
    }
  )
  
  support.test(
    "test concat()",
    __.concat(__.column('first_name'), ' ', __.column('last_name')),
    {
      pg:     'concat("first_name", \' \', "last_name")',
      mysql:  'concat(coalesce(`first_name`, \'\'), \' \', coalesce(`last_name`, \'\'))',
      mssql:  'concat([first_name], \' \', [last_name])',
      sqlite: 'coalesce("first_name", \'\') || \' \' || coalesce("last_name", \'\')',
    }
  )
  
  support.test(
    "test length()",
    __.length('foo'),
    {
      pg:     "length(foo)",
      mysql:  "length(foo)",
      mssql:  "len(foo)",
      sqlite: "length(foo)",
    }
  )
  
  support.test(
    "test replace()",
    __.replace(__.column('column'), __.esc('foo'), 'bar'),
    {
      pg:     "replace(\"column\", 'foo', $1)",
      mysql:  "replace(`column`, 'foo', ?)",
      mssql:  "replace([column], 'foo', ?)",
      sqlite: "replace(\"column\", 'foo', ?)",
    },
    [ 'bar' ]
  )
  
  support.test(
    "test substr()",
    __.substr(__.column('first_name'), 1, 1),
    {
      pg:     'substr("first_name", $1, $2)',
      mysql:  'substr(`first_name`, ?, ?)',
      mssql:  'substring([first_name], ?, ?)',
      sqlite: 'substr("first_name", ?, ?)',
    },
    [ 1, 1 ]
  )
  
  support.test(
    "test substr()",
    __.substr(__.esc('abcdefgh'), 4),
    {
      pg:     "substr('abcdefgh', $1)",
      mysql:  "substr('abcdefgh', ?)",
      mssql:  "substring('abcdefgh', ?, len('abcdefgh'))",
      sqlite: "substr('abcdefgh', ?)",
    },
    [ 4 ]
  )
  
  support.test(
    "test trim()",
    __.trim(__.column('name')),
    {
      pg:     'trim("name")',
      mysql:  'trim(`name`)',
      mssql:  'rtrim(ltrim([name]))',
      sqlite: 'trim("name")',
    }
  )
  
  support.test(
    "test rtrim()",
    __.rtrim(__.esc('foo  ')),
    {
      pg:     "rtrim('foo  ')",
      mysql:  "rtrim('foo  ')",
      mssql:  "rtrim('foo  ')",
      sqlite: "rtrim('foo  ')",
    }
  )
  
  support.test(
    "test ltrim()",
    __.ltrim(__.column('name')),
    {
      pg:     'ltrim("name")',
      mysql:  'ltrim(`name`)',
      mssql:  'ltrim([name])',
      sqlite: 'ltrim("name")',
    }
  )
  
  support.test(
    "test left()",
    __.left(__.column('first_name'), 3),
    {
      pg:     'left("first_name", $1)',
      mysql:  'left(`first_name`, ?)',
      mssql:  'left([first_name], ?)',
      sqlite: 'substr("first_name", 1, ?)',
    },
    [ 3 ]
  )
  
  support.test(
    "test right()",
    __.right(__.esc('foobar'), 3),
    {
      pg:     "right('foobar', $1)",
      mysql:  "right('foobar', ?)",
      mssql:  "right('foobar', ?)",
      sqlite: "substr('foobar', -?)",
    },
    [ 3 ]
  )
  
  support.test(
    "test strpos()",
    __.strpos(__.column('full_name'), 'foo'),
    {
      pg:     'strpos("full_name", $1)',
      mysql:  'instr(`full_name`, ?)',
      mssql:  'charindex(?, [full_name])',
      sqlite: 'instr("full_name", ?)',
    },
    [ 'foo' ]
  )
  
  support.test(
    "test repeat()",
    __.repeat(__.esc('sql'), 3),
    {
      pg:     "repeat('sql', $1)",
      mysql:  "repeat('sql', ?)",
      mssql:  "replicate('sql', ?)",
      sqlite: "replace(substr(quote(zeroblob((? + 1) / 2)), 3, ?1), '0', 'sql')",
    },
    [ 3 ]
  )
  
  support.test(
    "test repeat()",
    __.repeat('sql', 3),
    {
      pg:     "repeat(sql, $1)",
      mysql:  "repeat(sql, ?)",
      mssql:  "replicate(sql, ?)",
      sqlite: "replace(substr(quote(zeroblob((? + 1) / 2)), 3, ?1), '0', sql)",
    },
    [ 3 ]
  )
  
  support.test(
    "test space()",
    __.space(5),
    {
      pg:     "repeat(' ', $1)",
      mysql:  "space(?)",
      mssql:  "space(?)",
      sqlite: "replace(substr(quote(zeroblob((? + 1) / 2)), 3, ?1), '0', ' ')",
    },
    [ 5 ]
  )

  // mathematical functions

  support.test(
    "test rand()",
    __.rand(),
    {
      pg:     "rand()",
      mysql:  "rand()",
      mssql:  "rand()",
      sqlite: "(random() / 18446744073709551616 + 0.5)",
    }
  )

  support.test(
    "test abs()",
    __.abs(-9),
    {
      pg:     "abs($1)",
      mysql:  "abs(?)",
      mssql:  "abs(?)",
      sqlite: "abs(?)",
    },
    [ -9 ]
  )

  support.test(
    "test round()",
    __.round(123.4545, 2),
    {
      pg:     "round($1, $2)",
      mysql:  "round(?, ?)",
      mssql:  "round(?, ?)",
      sqlite: "round(?, ?)",
    },
    [ 123.4545, 2 ]
  )

  // date and time functions

  support.test(
    "test now()",
    __.now(),
    {
      pg:     "localtimestamp(0)",
      mysql:  "now()",
      mssql:  "cast(getdate() as datetime2(0))",
      sqlite: "datetime('now', 'localtime')",
    }
  )

  support.test(
    "test utc()",
    __.utc(),
    {
      pg:     "current_timestamp(0) at time zone 'UTC'",
      mysql:  "utc_timestamp()",
      mssql:  "cast(getutcdate() as datetime2(0))",
      sqlite: "datetime('now', 'utc')",
    }
  )

  support.test(
    "test today()",
    __.today(),
    {
      pg:     "current_date",
      mysql:  "current_date()",
      mssql:  "cast(getdate() as date)",
      sqlite: "date('now', 'localtime')",
    }
  )

  support.test(
    "test current_time()",
    __.curtime(),
    {
      pg:     "current_time(0)",
      mysql:  "current_time()",
      mssql:  "cast(getdate() as time(0))",
      sqlite: "time('now', 'localtime')",
    }
  )

  support.test(
    "test date()",
    __.date(__.esc('2017-03-02 09:20:25')),
    {
      pg:     "cast('2017-03-02 09:20:25' as date)",
      mysql:  "date('2017-03-02 09:20:25')",
      mssql:  "cast('2017-03-02 09:20:25' as date)",
      sqlite: "date('2017-03-02 09:20:25')",
    }
  )
  
  support.test(
    "test time()",
    __.time(__.column('created_at')),
    {
      pg:     'cast("created_at" as time(0))',
      mysql:  "time(`created_at`)",
      mssql:  "cast([created_at] as time(0))",
      sqlite: 'time("created_at")',
    }
  )
  
  support.test(
    "test day()",
    __.day(__.esc('2017-03-02 09:20:25')),
    {
      pg:     "extract(day from '2017-03-02 09:20:25')",
      mysql:  "day('2017-03-02 09:20:25')",
      mssql:  "day('2017-03-02 09:20:25')",
      sqlite: "cast(strftime('%d', '2017-03-02 09:20:25') as integer)",
    }
  )
  
  support.test(
    "test month()",
    __.month(__.esc('2017-03-02 09:20:25')),
    {
      pg:     "extract(month from '2017-03-02 09:20:25')",
      mysql:  "month('2017-03-02 09:20:25')",
      mssql:  "month('2017-03-02 09:20:25')",
      sqlite: "cast(strftime('%m', '2017-03-02 09:20:25') as integer)",
    }
  )
  
  support.test(
    "test year()",
    __.year(__.column('purchased_at')),
    {
      pg:     'extract(year from "purchased_at")',
      mysql:  "year(`purchased_at`)",
      mssql:  "year([purchased_at])",
      sqlite: "cast(strftime('%Y', \"purchased_at\") as integer)",
    }
  )
  
  support.test(
    "test hour()",
    __.hour(__.esc('2017-03-02 09:20:25')),
    {
      pg:     "extract(hour from '2017-03-02 09:20:25')",
      mysql:  "hour('2017-03-02 09:20:25')",
      mssql:  "datepart(hour, '2017-03-02 09:20:25')",
      sqlite: "cast(strftime('%H', '2017-03-02 09:20:25') as integer)",
    }
  )
  
  support.test(
    "test minute()",
    __.minute(__.esc('2017-03-02 09:20:25')),
    {
      pg:     "extract(minute from '2017-03-02 09:20:25')",
      mysql:  "minute('2017-03-02 09:20:25')",
      mssql:  "datepart(minute, '2017-03-02 09:20:25')",
      sqlite: "cast(strftime('%M', '2017-03-02 09:20:25') as integer)",
    }
  )
  
  support.test(
    "test second()",
    __.second(__.esc('2017-03-02 09:20:25')),
    {
      pg:     "extract(second from '2017-03-02 09:20:25')",
      mysql:  "second('2017-03-02 09:20:25')",
      mssql:  "datepart(second, '2017-03-02 09:20:25')",
      sqlite: "cast(strftime('%S', '2017-03-02 09:20:25') as integer)",
    }
  )
  
})