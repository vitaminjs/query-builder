
var Builder = require('../lib/index')
var assert = require('assert')

var qb = () => new Builder()

// var log = q => { q = q.compile('mysql'); console.log(q.sql, q.values.length ? q.values : '') }

function compile(qb) {
  return qb.compile('sqlite')
}

(function () {
  // compile an empty query builder
  var q = compile(qb())

  assert.equal(q.sql, "")
  assert.deepEqual(q.values, [])
})();

(function () {
  // compile a simple select query
  var q = compile(qb().from('table'))
  
  assert.equal(q.sql, 'select * from "table"')
  assert.deepEqual(q.values, [])
})();


// log(qb().from('table', 't'))
// log(qb().distinct().from('table'))
// log(qb().from('table', 't1').from('table2'))
// log(qb().from('photos').from(q => q.from('videos'), 'v'))

// log(qb().select('column').from('table', 't'))
// log(qb().select('column as c').from('table'))
// log(qb().select('title', 'author', 'year').from('books'))
// log(qb().select('foo', 'bar').from('table').unselect('bar'))

// log(qb().select('table.*').from('table', 't'))
// log(qb().select('table.column').from('schema.table'))

// log(qb().selectSub('1 + 1', 'operation'))
// log(qb().selectRaw('count(*) as count').from('table'))
// log(qb().selectSub(qb().selectRaw('count(*)').from('table'), 'count'))

// log(qb().avg('likes', 'avg_likes').from('table'))
// log(qb().countDistinct('*', 'count').from('table'))
// log(qb().min('salary', 'minSalary').max('salary', 'maxSalary').from('table'))
// log(qb().select('t1.sum_column1').from(q => q.sum('column1', 'sum_column1').from('table'), 't1'))

// log(qb().select('*').from('users').limit(10).offset(30))
// log(qb().select().from('products').orderBy('price', 'desc'))
// log(qb().select().from('products').limit(15).offset(45).orderByRaw('price = ?', 3))

// log(qb().select('department').sum('amount', 'sales').from('orders')
// .groupBy('department').having('sales', '>', 5000).orHavingRaw('sales < ?', [2000]))

// log(qb().select().from('users').where('id', 1))
// log(qb().select().from('users').where('name', '>', 100))
// log(qb().select().from('users').where('age', 'between', [25, 40]))
// log(qb().select().from('users').where('name', 'in', ['foo', 'bar']))
// log(qb().select().from('users').whereColumn('first_name', 'last_name'))
// log(qb().select().from('users').where({ is_admin: true, active: false }))
// log(qb().select().from('users').where(q => q.where('is_admin', true).orNot('status', 'active')))

// log(qb().from('users').whereNull('last_name').orderBy('x').union(q => q.select('*').from('users').whereNotNull('first_name')).limit(10))
// log(qb().select().from(q => q.from("foo").unionAll(q => q.from('bar').limit(5)), 'table').orderBy('a_column'))

// log(qb().from('foo').crossJoin('bar').whereNull('field'))
// log(qb().from('foo').join('bar', 'first', 'second').limit(15))
// log(qb().from('users').leftJoin('profiles as p', 'p.user_id', 'users.id'))
// log(qb().from('foo as f').join('bar as b', cr => cr.whereColumn('a.x', '=', 'f.y')))