/* global describe */

var fn      = require('../lib/helpers')
var support = require('./support')
var C       = fn.C

describe("test SQL functions:", () => {
  
  support.test(
    "test upper()",
    fn.UPPER('foo'),
    {
      pg:     "upper('foo')",
      mysql:  "upper('foo')",
      mssql:  "upper('foo')",
      sqlite: "upper('foo')",
    }
  )
  
  support.test(
    "test lower()",
    fn.LOWER(C('bar')),
    {
      pg:     'lower("bar")',
      mysql:  'lower(`bar`)',
      mssql:  'lower([bar])',
      sqlite: 'lower("bar")',
    }
  )
  
  support.test(
    "test concat()",
    fn.CONCAT(C('first_name'), ' ', C('last_name')),
    {
      pg:     'concat("first_name", \' \', "last_name")',
      mysql:  'concat(coalesce(`first_name`, \'\'), \' \', coalesce(`last_name`, \'\'))',
      mssql:  'concat([first_name], \' \', [last_name])',
      sqlite: 'coalesce("first_name", \'\') || \' \' || coalesce("last_name", \'\')',
    }
  )
  
  support.test(
    "test length()",
    fn.LENGTH('foo'),
    {
      pg:     "length('foo')",
      mysql:  "length('foo')",
      mssql:  "len('foo')",
      sqlite: "length('foo')",
    }
  )
  
  support.test(
    "test replace()",
    fn.REPLACE(C('column'), 'foo', 'bar'),
    {
      pg:     "replace(\"column\", 'foo', 'bar')",
      mysql:  "replace(`column`, 'foo', 'bar')",
      mssql:  "replace([column], 'foo', 'bar')",
      sqlite: "replace(\"column\", 'foo', 'bar')",
    }
  )
  
  support.test(
    "test substr()",
    fn.SUBSTR(C('first_name'), 1, 1),
    {
      pg:     'substr("first_name", 1, 1)',
      mysql:  'substr(`first_name`, 1, 1)',
      mssql:  'substring([first_name], 1, 1)',
      sqlite: 'substr("first_name", 1, 1)',
    }
  )
  
  support.test(
    "test substr()",
    fn.SUBSTR('abcdefgh', 4),
    {
      pg:     "substr('abcdefgh', 4)",
      mysql:  "substr('abcdefgh', 4)",
      mssql:  "substring('abcdefgh', 4, len('abcdefgh'))",
      sqlite: "substr('abcdefgh', 4)",
    }
  )
  
  support.test(
    "test trim()",
    fn.TRIM(C('name')),
    {
      pg:     'trim("name")',
      mysql:  'trim(`name`)',
      mssql:  'rtrim(ltrim([name]))',
      sqlite: 'trim("name")',
    }
  )
  
  support.test(
    "test rtrim()",
    fn.RTRIM('foo  '),
    {
      pg:     "rtrim('foo  ')",
      mysql:  "rtrim('foo  ')",
      mssql:  "rtrim('foo  ')",
      sqlite: "rtrim('foo  ')",
    }
  )
  
  support.test(
    "test ltrim()",
    fn.LTRIM(C('name')),
    {
      pg:     'ltrim("name")',
      mysql:  'ltrim(`name`)',
      mssql:  'ltrim([name])',
      sqlite: 'ltrim("name")',
    }
  )
  
  support.test(
    "test left()",
    fn.LEFT(C('first_name'), 3),
    {
      pg:     'left("first_name", 3)',
      mysql:  'left(`first_name`, 3)',
      mssql:  'left([first_name], 3)',
      sqlite: 'substr("first_name", 1, 3)',
    }
  )
  
  support.test(
    "test right()",
    fn.RIGHT('foobar', 3),
    {
      pg:     "right('foobar', 3)",
      mysql:  "right('foobar', 3)",
      mssql:  "right('foobar', 3)",
      sqlite: "substr('foobar', -3)",
    }
  )
  
  support.test(
    "test strpos()",
    fn.STRPOS(C('full_name'), 'foo'),
    {
      pg:     'strpos("full_name", \'foo\')',
      mysql:  'instr(`full_name`, \'foo\')',
      mssql:  'charindex(\'foo\', [full_name])',
      sqlite: 'instr("full_name", \'foo\')',
    }
  )
  
  support.test(
    "test repeat()",
    fn.REPEAT('sql', 3),
    {
      pg:     "repeat('sql', 3)",
      mysql:  "repeat('sql', 3)",
      mssql:  "replicate('sql', 3)",
      sqlite: "replace(substr(quote(zeroblob((3 + 1) / 2)), 3, 3), '0', 'sql')",
    }
  )
  
  support.test(
    "test space()",
    fn.REPEAT(5),
    {
      pg:     "repeat(' ', 5)",
      mysql:  "space(5)",
      mssql:  "space(5)",
      sqlite: "replace(substr(quote(zeroblob((5 + 1) / 2)), 3, 5), '0', ' ')",
    }
  )

  // mathematical functions

  support.test(
    "test rand()",
    fn.RAND(),
    {
      pg:     "rand()",
      mysql:  "rand()",
      mssql:  "rand()",
      sqlite: "(random() / 18446744073709551616 + 0.5)",
    }
  )

  support.test(
    "test abs()",
    fn.ABS(-9),
    {
      pg:     "abs(-9)",
      mysql:  "abs(-9)",
      mssql:  "abs(-9)",
      sqlite: "abs(-9)",
    }
  )

  support.test(
    "test round()",
    fn.ROUND(123.4545, 2),
    {
      pg:     "round(123.4545, 2)",
      mysql:  "round(123.4545, 2)",
      mssql:  "round(123.4545, 2)",
      sqlite: "round(123.4545, 2)",
    }
  )

  // date and time functions

  support.test(
    "test now()",
    fn.NOW(),
    {
      pg:     "localtimestamp(0)",
      mysql:  "now()",
      mssql:  "convert(datetime2(0), getdate())",
      sqlite: "datetime('now', 'localtime')",
    }
  )

  support.test(
    "test utc()",
    fn.UTC(),
    {
      pg:     "current_timestamp(0) at time zone 'UTC'",
      mysql:  "utc_timestamp()",
      mssql:  "convert(datetime2(0), getutcdate())",
      sqlite: "datetime('now', 'utc')",
    }
  )

  support.test(
    "test today()",
    fn.TODAY(),
    {
      pg:     "current_date",
      mysql:  "current_date()",
      mssql:  "convert(date, getdate())",
      sqlite: "date('now', 'localtime')",
    }
  )

  support.test(
    "test current_time()",
    fn.CURRENT_TIME(),
    {
      pg:     "current_time(0)",
      mysql:  "current_time()",
      mssql:  "convert(time(0), getdate())",
      sqlite: "time('now', 'localtime')",
    }
  )
  
})