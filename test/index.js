
var Query = require('../lib/builder').default

var qb = () => new Query()

var log = q => { q = q.compile(); console.log(q.sql, q.bindings.length ? q.bindings : '') }


log(qb())
log(qb().from('table'))
log(qb().from('table', 't'))
log(qb().distinct().from('table'))

log(qb().select('column').from('table', 't'))
log(qb().select('column as c').from('table'))
log(qb().select('title', 'author', 'year').from('books'))

log(qb().select('table.*').from('table', 't'))
log(qb().select('table.column').from('schema.table'))

log(qb().selectSub('1 + 1', 'operation'))
log(qb().selectRaw('count(*) as count').from('table'))
log(qb().selectSub(qb().selectRaw('count(*)').from('table'), 'count'))

log(qb().avg('likes', 'avg_likes').from('table'))
log(qb().countDistinct('*', 'count').from('table'))
log(qb().min('salary', 'minSalary').max('salary', 'maxSalary').from('table'))
log(qb().select('t1.sum_column1').from(q => q.sum('column1', 'sum_column1').from('table'), 't1'))

log(qb().select('*').from('users').limit(10).offset(30))
log(qb().select().from('products').orderBy('price', 'desc'))
log(qb().select().from('products').limit(15).offset(45).orderByRaw('price = ?', 3))

log(qb().select('department').sum('amount', 'sales').from('orders').groupBy('department').having('sales', '>', 5000))
log(qb().select('department').sum('amount', 'sales').from('orders').groupBy('department').havingRaw('department like ?', 'RH'))
