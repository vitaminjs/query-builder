
import Raw from './raw'
import {
  isArray, isFunction, isObject, isEmpty, isString,
  toArray, each, flatten, values, has
} from 'underscore'

/**
 * @class Query
 */
export default class Query {
  
  /**
   * Query builder constructor
   * 
   * @param {Compiler} compiler
   * @constructor
   */
  constructor(compiler) {
    this.take = null
    this.skip = null
    this.wheres = []
    this.groups = []
    this.orders = []
    this.columns = []
    this.table = null
    this.alias = null
    this.isDistinct = false
    
    this.bindings = []
    this.type = 'select'
    this.compiler = compiler
  }
  
  toSQL() {
    // reset bindings
    this.bindings = []
    
    return this.compiler.compile(this)
  }
  
  toString() {
    return this.toSQL()
  }
  
  newQuery() {
    return new Query(this.compiler)
  }
  
  // /**
  //  * 
  //  * 
  //  * @param {Any} column
  //  * @param {String} operator
  //  * @param {Any} value
  //  * @return Criteria instance
  //  */
  // criteria(column, operator, value) {
  //   return new Criteria(this.compiler).set(...arguments)
  // }
  
  /**
   * 
   * 
   * @param {String} expression
   * @param {Array} bindings
   * @return Raw instance
   */
  raw(expression, bindings = []) {
    return new Raw(this.compiler).set(...arguments)
  }
  
  /**
   * 
   * 
   * @param {Any} columns
   * @return this query
   */
  select(columns) {
    if (! isArray(columns) ) columns = toArray(arguments)
    
    if (! isEmpty(columns) ) this.columns.push(...columns)
    
    return this
  }
  
  distinct(bool = true) {
    this.isDistinct = bool
    return this
  }
  
  from(table, alias = null) {
    this.table = this._wrapped(table)
    this.alias = alias
    return this
  }
  
  /**
   * 
   * 
   * @param {Any} query
   * @param {String} name
   * @return this query
   */
  selectSub(query, name) {
    query = this._wrapped(query)
    
    if ( isString(query) ) query = this.raw(query).wrap()
    
    return this.selectRaw(this._wrappedRaw(query).as(name))
  }
  
  /**
   * 
   * 
   * @param {String} expr
   * @param {Object} bindings
   * @return this query
   */
  selectRaw(expr, bindings = []) {
    return this.select(this._wrappedRaw(...arguments))
  }
  
  /**
   * 
   * 
   * @return array
   */
  getBindings() {
    return flatten(this.bindings)
  }
  
  /**
   * 
   * 
   * @param {Any} value
   * @param {String} type
   * @return this query
   */
  addBinding(value, type = 'where') {
    this.bindings.push(value)
    return this
  }
  
  /**
   * 
   * 
   * @param {String} columns
   * @param {String} as
   * @return this query
   */
  count(columns = '*', as = null) {
    if (! isArray(columns) ) columns = [columns]
    
    return this._aggregate('count', columns, as, false)
  }
  
  /**
   * 
   * 
   * @param {String} columns
   * @param {String} as
   * @return this query
   */
  countDistinct(columns = '*', as = null) {
    if (! isArray(columns) ) columns = [columns]
    
    return this._aggregate('count', columns, as, true)
  }
  
  /**
   * 
   * 
   * @param {String} column
   * @param {String} as
   * @return this query
   */
  min(column, as = null) {
    return this._aggregate('min', [column], as)
  }
  
  /**
   * 
   * 
   * @param {String} column
   * @param {String} as
   * @return this query
   */
  max(column, as = null) {
    return this._aggregate('max', [column], as)
  }
  
  /**
   * 
   * 
   * @param {String} column
   * @param {String} as
   * @return this query
   */
  sum(column, as = null) {
    return this._aggregate('sum', [column], as)
  }
  
  /**
   * 
   * 
   * @param {String} column
   * @param {String} as
   * @return this query
   */
  avg(column, as = null) {
    return this._aggregate('avg', [column], as)
  }
  
  /**
   * 
   * 
   * @param {Integer} value
   * @return this query
   */
  limit(value) {
    if ( (value = parseInt(value, 10)) > 0 ) this.take = value
    
    return this
  }
  
  /**
   * 
   * 
   * @param {Integer} value
   * @return this query
   */
  offset(value) {
    if ( (value = parseInt(value, 10)) >= 0 ) this.skip = value
    
    return this
  }
  
  /**
   * 
   * 
   * @param {Array} columns
   * @return this query
   */
  groupBy(columns) {
    if (! isArray(columns) ) columns = toArray(arguments)
    
    if (! isEmpty(columns) ) this.groups.push(...columns)
    
    return this
  }
  
  /**
   * 
   * 
   * @param {String} expr
   * @return this query
   */
  groupByRaw(expr) {
    return this.groupBy(this._wrappedRaw(expr))
  }
  
  /**
   * 
   * 
   * @param {String} column
   * @return this query
   */
  orderBy(column, direction = 'asc') {
    if ( direction.toLowerCase() !== 'asc' ) direction = 'desc'
    
    if (! isArray(column) ) column = [column]
    
    this.orders.push({ column, direction })
    
    return this
  }
  
  /**
   * 
   * 
   * @param {String} expr
   * @param {Array} bindings
   * @return this query
   */
  orderByRaw(expr, bindings = []) {
    this.orders.push(this._wrappedRaw(...arguments))
    return this
  }
  
  isQuery(value) {
    return value instanceof Query
  }
  
  isRaw(value) {
    return value instanceof Raw
  }
  
  /**
   * 
   * 
   * @param {String} method
   * @param {Array} columns
   * @param {String} name
   * @param {Boolean} distinct
   * @return this query
   */
  _aggregate(method, columns, name = null, isDistinct = false) {
    var distinct = isDistinct ? 'distinct ' : ''
    
    columns = `(${distinct}${this.compiler.columnize(columns)})`
    
    return this.selectRaw(this.raw(method + columns).as(name))
  }
  
  /**
   * 
   * 
   * @param {Query|Function} value
   * @return Raw instance
   */
  _wrapped(value) {
    if ( isFunction(value) ) {
      let fn = value
      
      fn(value = this.newQuery())
    }
    
    if ( this.isQuery(value) ) {
      value = this.raw(value.toSQL(), value.getBindings()).wrap()
    }
    
    return value
  }
  
  _wrappedRaw(expr, bindings = [], wrap = false) {
    if ( isString(expr) ) expr = this.raw(expr, bindings)
    
    if (! this.isRaw(expr) ) throw new TypeError("Invalid raw expression")
    
    return wrap ? expr.wrap() : expr
  }
  
  // into(table) {
  //   return this.from(table)
  // }
  
  // join(table, one, op = null, two = null, type = 'inner') {
  //   // TODO
  // }
  
  // where(column, op = null, value = null, bool = 'AND') {
  //   if ( isObject(column) ) return this.whereObject(column, bool)
    
  //   if ( isFunction(column) ) return this._addObjectWhere(column, bool)
    
  //   if ( arguments.length === 2 ) {
  //     value = op
  //     op = '='
  //   }
    
  //   if ( isArray(value) ) return this.whereIn(column, value)
    
  //   this.wheres.push({ column, op, value, type: 'basic' })
    
  //   return this
  // }
  
  // _addObjectWhere(obj, bool = 'AND', method = 'where') {
  //   return this.whereNested(q => {
      
  //     each(obj, (value, key) => {
  //       q[method](key, value, null, bool)
  //     })
      
  //   }, bool)
  // }
  
  // whereNested(fn, bool = 'AND') {
  //   var query = this.newQuery().from(this._table, this._alias)
    
  //   fn.call(null, query)
    
  //   return this.addNestedQuery(query, bool)
  // }
  
  // addNestedQuery(query, bool = 'AND') {
  //   if (! isEmpty(query.wheres) ) {
      
  //   }
    
  //   return this
  // }
  
  // orWhere(column, op = null, value = null) {
  //   return this.where(column, op, value, 'OR')
  // }
  
}