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
      'accepts literal values',
      qb.select(123, true, null, "'xyz'"),
      {
        pg: "select 123, true, null, 'xyz'",
        mysql: "select 123, true, null, 'xyz' from dual",
        mssql: "select 123, true, null, 'xyz'",
        sqlite: "select 123, true, null, 'xyz'"
      }
    )

    support.test(
      'accepts raw expressions',
      qb.select(qb.raw('(1 + ?) as operation', 2)),
      {
        pg: 'select (1 + $1) as operation',
        mysql: 'select (1 + ?) as operation from dual',
        mssql: 'select (1 + ?) as operation',
        sqlite: 'select (1 + ?) as operation'
      },
      [
        2
      ]
    )

    support.test(
      'accepts sub queries',
      qb.select(qb.select('count(*)').from('atable').as('result')),
      {
        pg: 'select (select count(*) from atable) as "result"',
        mysql: 'select (select count(*) from atable) as `result` from dual',
        mssql: 'select (select count(*) from atable) as [result]',
        sqlite: 'select (select count(*) from atable) as "result"'
      }
    )

    support.test(
      'selects distinct columns',
      qb.select('foo', qb.id('bar')).distinct(),
      {
        pg: 'select distinct foo, "bar"',
        mysql: 'select distinct foo, `bar` from dual',
        mssql: 'select distinct foo, [bar]',
        sqlite: 'select distinct foo, "bar"'
      }
    )
  })

  describe('test from():', () => {
    support.test(
      'accepts a raw table expression',
      qb.selectFrom('table'),
      {
        pg: 'select * from table',
        mysql: 'select * from table',
        mssql: 'select * from table',
        sqlite: 'select * from table'
      }
    )

    support.test(
      'adds a table expression',
      qb.selectFrom(qb.id('schema.table').as('alias')),
      {
        pg: 'select * from "schema"."table" as "alias"',
        mysql: 'select * from `schema`.`table` as `alias`',
        mssql: 'select * from [schema].[table] as [alias]',
        sqlite: 'select * from "schema"."table" as "alias"'
      }
    )

    support.test(
      'accepts more than one table for `from` clause',
      qb.selectFrom('a', 'b'),
      {
        pg: 'select * from a, b',
        mysql: 'select * from a, b',
        mssql: 'select * from a, b',
        sqlite: 'select * from a, b'
      }
    )

    support.test(
      'appends more tables when called multiple times',
      qb.select().from('a').from('b'),
      {
        pg: 'select * from a, b',
        mysql: 'select * from a, b',
        mssql: 'select * from a, b',
        sqlite: 'select * from a, b'
      }
    )

    support.test(
      'accepts raw expressions',
      qb.selectFrom(qb.raw('schema.table as t')),
      {
        pg: 'select * from schema.table as t',
        mysql: 'select * from schema.table as t',
        mssql: 'select * from schema.table as t',
        sqlite: 'select * from schema.table as t'
      }
    )

    support.test(
      'accepts sub queries',
      qb.selectFrom(qb.select('*').from('a_table').as('t')),
      {
        pg: 'select * from (select * from a_table) as "t"',
        mysql: 'select * from (select * from a_table) as `t`',
        mssql: 'select * from (select * from a_table) as [t]',
        sqlite: 'select * from (select * from a_table) as "t"'
      }
    )
  })

  describe('test join():', () => {
    support.test(
      'adds a basic join clause',
      qb.select().from('posts as p').join('users a').on('p.author_id = a.id'),
      {
        pg: 'select * from posts as p inner join users a on (p.author_id = a.id)',
        mysql: 'select * from posts as p inner join users a on (p.author_id = a.id)',
        mssql: 'select * from posts as p inner join users a on (p.author_id = a.id)',
        sqlite: 'select * from posts as p inner join users a on (p.author_id = a.id)'
      }
    )

    support.test(
      'adds a table join with more than one condition',
      qb.selectFrom('departments d').join('employees e').on('e.department_id = d.id and e.salary > ?', 2500),
      {
        pg: 'select * from departments dept inner join employees emp on (emp.department_id = dept.id and emp.salary > $1)',
        mysql: 'select * from departments dept inner join employees emp on (emp.department_id = dept.id and emp.salary > ?)',
        mssql: 'select * from departments dept inner join employees emp on (emp.department_id = dept.id and emp.salary > ?)',
        sqlite: 'select * from departments dept inner join employees emp on (emp.department_id = dept.id and emp.salary > ?)'
      },
      [
        2500
      ]
    )

    support.test(
      'adds a raw join expression',
      qb.selectFrom(qb.id('table1')).join(qb.raw(`natural full join ?`, qb.id('table2'))),
      {
        pg: 'select * from "table1" natural full join "table2"',
        mysql: 'select * from `table1` natural full join `table2`',
        mssql: 'select * from [table1] natural full join [table2]',
        sqlite: 'select * from "table1" natural full join "table2"'
      }
    )

    support.test(
      'adds a join with a sub query',
      qb.selectFrom('table1').crossJoin(qb.selectFrom('table2')),
      {
        pg: 'select * from table1 cross join (select * from table2)',
        mysql: 'select * from table1 cross join (select * from table2)',
        mssql: 'select * from table1 cross join (select * from table2)',
        sqlite: 'select * from table1 cross join (select * from table2)'
      }
    )

    support.test(
      'adds a join with using clause',
      qb.selectFrom('table1 as t1').leftJoin('table2 t2').using('some_id'),
      {
        pg: 'select * from table1 as t1 left join table2 t2 using (some_id)',
        mysql: 'select * from table1 as t1 left join table2 t2 using (some_id)',
        mssql: 'select * from table1 as t1 left join table2 t2 using (some_id)',
        sqlite: 'select * from table1 as t1 left join table2 t2 using (some_id)'
      }
    )

    support.test(
      'adds multiple joins',
      qb.selectFrom('a').join('b').on('a.id = b.other_id').leftJoin('c').using('some_column'),
      {
        pg: 'select * from a inner join b on (a.id = b.other_id) left join c using (some_column)',
        mysql: 'select * from a inner join b on (a.id = b.other_id) left join c using (some_column)',
        mssql: 'select * from a inner join b on (a.id = b.other_id) left join c using (some_column)',
        sqlite: 'select * from a inner join b on (a.id = b.other_id) left join c using (some_column)'
      }
    )

    // join precedence
  })
})
