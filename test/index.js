
var Query = require('../lib/builder').default
var Compiler = require('../lib/compiler').default

var qb = new Query(new Compiler)
var log = console.log


log(qb.newQuery().toSQL())
log(qb.newQuery().from('table').toSQL())
log(qb.newQuery().from('table', 't').toSQL())
log(qb.newQuery().distinct().from('table').toSQL())

log(qb.newQuery().select('column').from('table', 't').toSQL())
log(qb.newQuery().select('column as c').from('table').toSQL())
log(qb.newQuery().select('title', 'author', 'year').from('books').toSQL())

log(qb.newQuery().select('table.*').from('table', 't').toSQL())
log(qb.newQuery().select('table.column').from('schema.table').toSQL())

log(qb.newQuery().selectSub('1 + 1', 'operation').toSQL())
log(qb.newQuery().selectRaw('count(*) as count').from('table').toSQL())
log(qb.newQuery().selectSub(qb.newQuery().selectRaw('count(*)').from('table'), 'count').toSQL())

log(qb.newQuery().count('*', 'count').from('table').toSQL())
log(qb.newQuery().avg('likes', 'avg_likes').from('table').toSQL())
log(qb.newQuery().min('salary', 'minSalary').max('salary', 'maxSalary').from('table').toSQL())

log(qb.newQuery().select('t1.sum_column1').from(q => q.sum('column1', 'sum_column1').from('table'), 't1').toSQL())
log(qb.newQuery().select('*').from('users').limit(10).offset(30).toSQL())
log(qb.newQuery().select('department').sum('amount', 'sales').from('orders').groupBy('department').toSQL())
log(qb.newQuery().select().from('products').orderBy('price', 'desc').toSQL())

log(qb.newQuery().select().from('products').orderByRaw('price = ?', [3]).toSQL())

var q1 = qb.newQuery().select().from('products').limit(15).offset(45).orderByRaw('price = ?', 3)
log(q1.toSQL(), q1.getBindings())