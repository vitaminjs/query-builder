
import Raw from './raw'
import Compiler from './compiler'
import Criteria from './criteria'
import Aggregate from './aggregate'
import { isArray, isFunction, isEmpty, isString, isObject, toArray } from 'lodash'

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
    this.tables = []
    this.columns = []
    this.havings = []
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
  
  newCriteria() {
    return new Criteria(this)
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
    if ( isString(table) ) table = { 'name': table, alias }
    else {
      table = this._wrappedQuery(table).as(alias)
    }
    
    this.tables.push(table)
    
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
  
  having(column, operator, value, prefix = 'and', negate = false) {
    this.havings.push(this.newCriteria().where(...arguments))
    return this
  }
  
  orHaving(column, operator, value) {
    return this.having(column, operator, value, 'or')
  }
  
  andHaving(column, operator, value) {
    return this.having(...arguments)
  }
  
  /**
   * 
   * @param {String} expr
   * @param {Array} bindings
   * @param {String} prefix
   * @return this query
   */
  havingRaw(expr, bindings = [], prefix = 'and') {
    this.havings.push(this.newCriteria().whereRaw(...arguments))
    return this
  }
  
  /**
   * 
   * @param {String} expr
   * @param {Array} bindings
   * @return this query
   */
  orHavingRaw(expr, bindings = []) {
    return this.havingRaw(expr, bindings, 'or')
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
  
}