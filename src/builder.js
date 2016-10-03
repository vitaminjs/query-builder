
import Raw from './raw'
import Compiler from './compiler'
import Aggregate from './aggregate'
import { isArray, isFunction, isEmpty, isString, toArray } from 'underscore'

/**
 * @class Query
 */
export default class Query {
  
  /**
   * 
   * @constructor
   */
  constructor() {
    this.take = null
    this.skip = null
    this.wheres = []
    this.groups = []
    this.orders = []
    this.columns = []
    this.table = null
    this.alias = null
    this.isDistinct = false
    
    this.type = 'select'
  }
  
  compiler() {
    return new Compiler()
  }
  
  compile() {
    return this.compiler().compile(this, this.type)
  }
  
  toString() {
    return this.compile().sql
  }
  
  newQuery() {
    return new Query(this.compiler())
  }
  
  /**
   * 
   * 
   * @param {String} expression
   * @param {Array} bindings
   * @return Raw instance
   */
  raw(expression, bindings = []) {
    return new Raw(expression, bindings)
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
    this.table = this._wrappedQuery(table)
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
    query = this._wrappedQuery(query)
    
    if ( isString(query) ) 
      query = this.raw(query).wrap()
    
    return this.selectRaw(query.as(name))
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
   * @param {String} column
   * @param {String} as
   * @return this query
   */
  count(column = '*', as = null) {
    return this.selectAggregate('count', column, as, false)
  }
  
  /**
   * 
   * 
   * @param {String} column
   * @param {String} as
   * @return this query
   */
  countDistinct(column = '*', as = null) {
    return this.selectAggregate('count', column, as, true)
  }
  
  /**
   * 
   * 
   * @param {String} column
   * @param {String} as
   * @return this query
   */
  min(column, as = null) {
    return this.selectAggregate('min', column, as)
  }
  
  /**
   * 
   * 
   * @param {String} column
   * @param {String} as
   * @return this query
   */
  max(column, as = null) {
    return this.selectAggregate('max', column, as)
  }
  
  /**
   * 
   * 
   * @param {String} column
   * @param {String} as
   * @return this query
   */
  sum(column, as = null) {
    return this.selectAggregate('sum', column, as)
  }
  
  /**
   * 
   * 
   * @param {String} column
   * @param {String} as
   * @return this query
   */
  avg(column, as = null) {
    return this.selectAggregate('avg', column, as)
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
  
  /**
   * 
   * 
   * @param {String} method
   * @param {String} column
   * @param {String} name
   * @param {Boolean} isDistinct
   * @return this query
   */
  selectAggregate(method, column, name = null, isDistinct = false) {
    return this.select(new Aggregate(...arguments))
  }
  
  /**
   * 
   * 
   * @param {Query|Function} value
   * @return Raw instance
   */
  _wrappedQuery(value) {
    if ( isFunction(value) ) {
      let fn = value
      
      fn(value = this.newQuery())
    }
    
    if ( value instanceof Query ) {
      let q = value.compile()
      
      value = this.raw(q.sql, q.bindings).wrap()
    }
    
    return value
  }
  
  /**
   * 
   * @param {String} expr
   * @param {Array} bindings
   */
  _wrappedRaw(expr, bindings = []) {
    if ( isString(expr) ) 
      expr = this.raw(expr, bindings)
    
    if ( expr instanceof Raw ) return expr 
    
    throw new TypeError("Invalid raw expression")
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