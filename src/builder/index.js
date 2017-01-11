
import { isString, isArray, isBoolean, isFunction, isEmpty, isPlainObject, toArray, each, remove } from 'lodash'
import Expression, { Raw, Join, Aggregate, SubQuery, Order, Column, Table, Union } from '../expression'
import Compiler, { createCompiler } from './compiler'
import { Criteria } from './criterion'
import { Select } from './query'

const SELECT_QUERY = 'select'
const INSERT_QUERY = 'insert'
const UPDATE_QUERY = 'update'
const DELETE_QUERY = 'delete'

/**
 * @class QueryBuilder
 */
export default class Builder {
  
  /**
   * 
   * @constructor
   */
  constructor() {
    this.joins        = []
    this.tables       = []
    this.unions       = []
    this.groups       = []
    this.orders       = []
    this.columns      = []
    this.unionOrders  = []
    this._type        = null
    this._limit       = null
    this._offset      = null
    this._unionLimit  = null
    this._unionOffset = null
    this._distinct    = false
    
    this.conditions       = this.newCriteria()
    this.havingConditions = this.newCriteria()
  }
  
  get type() {
    return this._type
  }
  
  set type(value) {
    if ( this._type == null ) this._type = value
    
    // multiple types is not supported
    if ( this._type !== value )
      throw new TypeError("Ambiguous query type")
  }
  
  get hasUnions() {
    return this.unions.length > 0
  }
  
  /**
   * 
   * @return Query instance
   */
  build() {
    // TODO
  }
  
  /**
   * 
   * @param {String|Compiler} dialect
   * @throws {TypeError}
   * @return plain object
   */
  compile(dialect) {
    if ( isString(dialect) )
      dialect = createCompiler(dialect)
    
    if (! (dialect instanceof Compiler) )
      throw new TypeError("Invalid query compiler")
    
    return dialect.compile(this.build())
  }
  
  /**
   * 
   * @param {Array} columns
   * @return this
   */
  select(columns) {
    if ( isArray(columns) ) columns = toArray(arguments)
    
    // set the type of the query to build
    this.type = SELECT_QUERY
    
    // add the columns
    columns.forEach(value => {
      if ( isString(value) ) value = new Column(value)
      
      if (! (value instanceof Expression) )
        throw new TypeError("Invalid column expression")
      
      this.columns.push(value)
    })
    
    return this
  }
  
  /**
   * 
   * @param {Array} columns
   * @return this
   */
  unselect(columns) {
    if ( isArray(columns) ) columns = toArray(arguments)
    
    // remove the given columns
    columns.forEach(col => remove(this.columns, c => c.isEqual(col)))
    
    return this
  }
  
  /**
   * 
   * @param {Boolean} flag
   * @return this
   */
  distinct(flag = true) {
    this._distinct = flag
    return this
  }
  
  /**
   * Add distinct columns to the query
   * 
   * @param {Array} columns
   * @return this
   */
  selectDistinct(columns) {
    return this.select(...arguments).distinct()
  }
  
  /**
   * 
   * @param {Query|Function} query
   * @param {String} column
   */
  selectSub(query, column = '') {
    return this.select(this.ensureSubQuery(query).as(column))
  }
  
  /**
   * @param {String|Raw} expr
   * @param {Array} Bindings
   * @return this
   */
  selectRaw(expr, bindings = []) {
    return this.select(this.ensureRaw(expr, bindings))
  }
  
  /**
   * 
   * @param {String} columns
   * @param {Boolean} distinct
   * @return this
   */
  selectCount(columns = '*', distinct = false) {
    return this.selectAggregate('count', columns, distinct)
  }
  
  /**
   * @param {String} column
   * @param {Boolean} distinct
   * @return this
   */
  selectMin(column, distinct = false) {
    return this.selectAggregate('min', column, distinct)
  }
  
  /**
   * @param {String} column
   * @param {Boolean} distinct
   * @return this
   */
  selectMax(column, distinct = false) {
   return this.selectAggregate('max', column, distinct)
  }
  
  /**
   * @param {String} column
   * @param {Boolean} distinct
   * @return this
   */
  selectSum(column, distinct = false) {
    return this.selectAggregate('sum', column, distinct)
  }
  
  /**
   * @param {String} column
   * @param {Boolean} distinct
   * @return this
   */
  selectAvg(column, distinct = false) {
    return this.selectAggregate('avg', column, distinct)
  }
  
  /**
   * @param {String} column
   * @param {Boolean} distinct
   * @return this
   * @alias `selectAvg`
   */
  selectAverage(column, distinct = false) {
    return this.selectAvg(...arguments)
  }
  
  /**
   * 
   * @param {Any} value
   * @return this
   */
  from(value) {
    if ( isString(value) ) value = new Table(value)
    
    if (! (value instanceof Expression) )
      throw new TypeError("Invalid table expression")
    
    this.tables.push(value)
    
    return this
  }
  
  /**
   * 
   * @param {String|Raw} expr
   * @param {Array} bindings
   * @return this
   */
  fromRaw(expr, bindings = []) {
    return this.from(this.ensureRaw(expr, bindings))
  }
  
  /**
   * 
   * @param {Query|Function} query
   * @param {String} table
   * @return this
   */
  fromSub(query, table = '') {
    return this.from(this.ensureSubQuery(query).as(table))
  }
  
  /**
   * 
   * @param {Integer} value
   * @return this
   */
  limit(value) {
    if ( (value = parseInt(value, 10)) > 0 )
      this[this.hasUnions ? '_unionLimit' : '_limit'] = value
    
    return this
  }
  
  /**
   * 
   * @param {Integer} value
   * @return this
   */
  offset(value) {
    if ( (value = parseInt(value, 10)) > 0 )
      this[this.hasUnions ? '_unionLimit' : '_limit'] = value
    
    return this
  }
  
  /**
   * 
   * @param {Array} columns
   * @return this
   */
  groupBy(columns) {
    if (! isArray(columns) ) columns = toArray(arguments)
    
    columns.forEach(value => {
      if ( isString(value) ) value = new Column(value)
      
      if (! (value instanceof Expression) )
        throw new TypeError("Invalid group expression")
      
      this.groups.push(value)
      
      // select also the grouped columns
      // TODO check duplicates before addition
      this.columns.push(value)
    })
    
    return this
  }
  
  /**
   * 
   * @param {String|Raw} expr
   * @param {Array} bindings
   * @return this
   */
  groupByRaw(expr, bindings = []) {
    this.groupBy(this.ensureRaw(expr, bindings))
  }
  
  /**
   * 
   * @param {Array} columns
   */
  orderBy(columns) {
    var orders = this[this.hasUnions ? 'unionOrders' : 'orders']
    
    if (! isArray(columns) ) columns = toArray(arguments)
    
    columns.forEach(value => {
      if ( isString(value) ) value = new Order(value)
      
      if (! (value instanceof Expression) )
        throw new TypeError("Invalid order expression")
      
      orders.push(value)
    })
    
    return this
  }
  
  /**
   * 
   * @param {String|Raw} expr
   * @param {Array} bindings
   * @return this
   */
  orderByRaw(expr, bindings = []) {
    return this.orderBy(this.ensureRaw(expr, bindings))
  }
  
  /**
   * 
   * @param {Any} query
   * @param {Boolan} all
   * @return this
   */
  union(query, all = false) {
    var union = new Union(this.ensureSubQuery(query), all)
    
    this.unions.push(union)
    
    return this
  }
  
  /**
   * 
   * @param {Any} query
   * @return this
   */
  unionAll(query) {
    return this.union(query, true)
  }
  
  /**
   * 
   * @param {String} table
   * @param {String} first
   * @param {String} operator
   * @param {String} second
   * @param {String} type
   * @return this
   */
  join(table, first, operator, second, type = 'inner') {
    var criteria = null
    
    // add the join criteria object
    if ( first != null ) {
      let builder = this.newBuilder()
      
      if ( operator && !second ) {
        second = operator
        operator = '='
      }
      
      // usually, a join clause compare between 2 columns
      if ( isString(second) )
        builder.whereColumn(first, operator, second)
      else
        builder.where(first, operator, second)
      
      // set the join conditions
      criteria = builder.conditions
    }
    
    this.joins.push(new Join(table, type, criteria))
    
    return this
  }
  
  /**
   * 
   * @param {String|Raw} expr
   * @param {Array} bindings
   * @return this
   */
  joinRaw(expr, bindings = []) {
    this.joins.push(this.ensureRaw(expr, bindings))
    return this
  }
  
  /**
   * 
   * @param {Any} query
   * @param {String} first
   * @param {String} operator
   * @param {String} second
   * @param {String} type
   * @return this
   */
  joinSub(query, first, operator, second, type = 'inner') {
    return this.join(this.ensureSubQuery(query), first, operator, second, type)
  }
  
  /**
   * 
   * @param {String} table
   * @param {String} first
   * @param {String} operator
   * @param {String} second
   * @return this
   * @alias `join()`
   */
  innerJoin(table, first, operator, second) {
    return this.join(table, first, operator, second)
  }
  
  /**
   * 
   * @param {String} table
   * @param {String} first
   * @param {String} operator
   * @param {String} second
   * @return this
   */
  crossJoin(table, first, operator, second) {
    return this.join(table, first, operator, second, 'cross')
  }
  
  /**
   * 
   * @param {String} table
   * @param {String} first
   * @param {String} operator
   * @param {String} second
   * @return this
   */
  rightJoin(table, first, operator, second) {
    return this.join(table, first, operator, second, 'right')
  }
  
  /**
   * 
   * @param {String} table
   * @param {String} first
   * @param {String} operator
   * @param {String} second
   * @return this
   */
  leftJoin(table, first, operator, second) {
    return this.join(table, first, operator, second, 'left')
  }
  
  /**
   * 
   * @param {String} table
   * @param {String} first
   * @param {String} operator
   * @param {String} second
   * @return this
   */
  outerJoin(table, first, operator, second) {
    return this.join(table, first, operator, second, 'outer')
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @param {Boolean} not
   * @return this
   */
  where(expr, operator, value, bool = 'and', not = false) {
    if ( value != null && operator == null ) {
      value = operator
      operator = '='
    }
    
    // supports `.where(Boolean)`
    if ( isBoolean(expr) ) {
      let bool = expr
      
      expr = new Raw('1 = ' + bool ? 1 : 0)
    }
    
    // supports `.where(new Raw(...))`
    if ( expr instanceof Raw )
      return this.whereRaw(expr, [], bool)
    
    // supports `.where({a: 1, b: 3})`
    if ( isPlainObject(expr) ) {
      let obj = expr
      
      expr = qb => each(obj, (val, key) => qb.where(key, '=', val))
    }
    
    // supports `.where(qb => { ... })`
    if ( isFunction(expr) ) {
      let fn = expr
      
      fn(expr = this.newBuilder())
    }
    
    // supports nested builders
    if ( expr instanceof Builder )
      expr = expr.conditions
    
    // format the operator
    operator = String(operator).toLowerCase().trim()
    
    // supports between operator
    if ( operator.indexOf('between') > -1 )
      return this.whereBetween(expr, value, bool, not)
    
    // escape percentages and underscores for like comparaison
    if ( operator.indexOf('like') > -1 )
      value = value.replace(/(_|%)/g, '\\$1')
    
    // supports `.where('column', null)`
    if ( value === null )
      return this.whereNull(expr, bool, not)
    
    // supports `.where('column', [...])`
    if ( isArray(value) && operator === '=' )
      return this.whereIn(expr, value, bool, not)
    
    // supports sub queries
    if (
      isFunction(value) ||
      value instanceof Select ||
      value instanceof Builder ||
      value instanceof SubQuery
    ) return this.whereSub(expr, operator, value, bool)
    
    // usual basic condition
    this.conditions.where(this.ensureColumn(expr), operator, value, bool, not)
    
    return this
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {Boolean} not
   * @return this
   */
  orWhere(expr, operator, value) {
    return this.where(expr, operator, value, 'or')
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @return this
   */
  whereNot(expr, operator, value, bool = 'and') {
    var not = true
    
    if ( value != null && operator == null ) {
      value = operator
      operator = '='
    }
    
    // format the operator
    operator = String(operator).toLowerCase().trim()
    
    // supports `.whereNot('column', 'between', [...])`
    if ( operator === 'between' )
      return this.whereBetween(expr, operator, value, bool, not)
    
    // supports `.whereNot('column', 'in', [...])`
    if ( operator === 'in' )
      return this.whereIn(expr, operator, value, bool, not)
    
    // supports `.whereNot('column', 'like', 'patern')`
    if ( operator === 'like' ) {
      operator = 'not like'
      not = false
    }
    
    return this.where(expr, operator, value, bool, not)
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @return this
   */
  orWhereNot(expr, operator, value) {
    return this.whereNot(expr, operator, value, 'or')
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {Array} values
   * @param {String} bool
   * @param {Boolean} not
   * @return this
   */
  whereBetween(expr, values, bool = 'and', not = false) {
    if (! (isArray(values) && values.length === 2) )
      throw new TypeError("Invalid between condition")
    
    this.conditions.whereBetween(this.ensureColumn(expr), values, bool, not)
    
    return this
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {Array} values
   * @return this
   */
  orWhereBetween(expr, values) {
    return this.whereBetween(expr, values, 'or')
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {Array} values
   * @param {String} bool
   * @return this
   */
  whereNotBetween(expr, values, bool = 'and') {
    return this.whereBetween(expr, values, bool, true)
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {Array} values
   * @return this
   */
  orWhereNotBetween(expr, values) {
    return this.whereNotBetween(expr, values, 'or')
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {Any} values
   * @param {String} bool
   * @param {Boolean} not
   * @return this
   */
  whereIn(expr, values, bool = 'and', not = false) {
    // instead of an empty array of values, a boolean expression is used
    if ( isArray(values) && isEmpty(values) ) return this.where(not)
    
    // accepts sub queries
    if (! isArray(values) ) values = this.ensureSubQuery(values)
    
    this.conditions.whereIn(this.ensureColumn(expr), values, bool, not)
    
    return this
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {Any} values
   * @return this
   */
  orWhereIn(expr, values) {
    return this.whereIn(expr, values, 'or')
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {Any} values
   * @param {String} bool
   * @return this
   */
  whereNotIn(expr, values, bool = 'and') {
    return this.whereIn(expr, values, bool, true)
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {Any} values
   * @return this
   */
  orWhereNotIn(expr, values) {
    return this.whereNotIn(expr, values, 'or')
  }
  
  /**
   * 
   * @param {String|Expression} expr
   * @param {String} operator
   * @param {Any} query
   * @param {String} bool
   * @return this
   */
  whereSub(expr, operator, query, bool = 'and') {
    if ( isString(expr) )
      expr = new Column(expr)
    
    if (! (expr instanceof Expression) )    
      throw new TypeError("Invalid expression")
    
    this.conditions.whereSub(expr, operator, this.ensureSubQuery(query), bool)
    
    return this
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {String} operator
   * @param {Any} query
   * @return this
   */
  orWhereSub(expr, operator, query) {
    return this.whereSub(expr, operator, query, 'or')
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {String} bool
   * @param {Boolean} not
   * @return this
   */
  whereNull(expr, bool = 'and', not = false) {
    this.conditions.whereNull(this.ensureColumn(expr), bool, not)
    return this
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @return this
   */
  orWhereNull(expr) {
    return this.whereNull(expr, 'or')
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {String} bool
   * @return this
   */
  whereNotNull(expr, bool = 'and') {
    return this.whereNull(expr, bool)
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @return this
   */
  orWhereNotNull(expr) {
    return this.whereNotNull(expr, 'or')
  }
  
  /**
   * 
   * @param {String|Raw} expr
   * @param {Array} bindings
   * @param {String} bool
   * @return this
   */
  whereRaw(expr, bindings = [], bool = 'and') {
    this.conditions.whereRaw(this.ensureRaw(expr, bindings), bool)
    return this
  }
  
  /**
   * 
   * @param {String|Raw} expr
   * @param {Array} bindings
   * @param {String} bool
   * @return this
   */
  orWhereRaw(expr, bindings = []) {
    return this.whereRaw(expr, bindings, 'or')
  }
  
  /**
   * 
   * @param {SubQuery} query
   * @param {String} bool
   * @param {Boolean} not
   * @return this
   */
  whereExists(query, bool = 'and', not = false) {
    query = this.ensureSubQuery(query)
    
    return this.conditions.whereExists(query, bool, not)
  }
  
  /**
   * 
   * @param {SubQuery} query
   * @return this
   */
  orWhereExists(query) {
    return this.whereExists(query, 'or')
  }
  
  /**
   * 
   * @param {SubQuery} query
   * @param {String} bool
   * @return this
   */
  whereNotExists(query, bool = 'and') {
    return this.whereExists(query, bool, true)
  }
  
  /**
   * 
   * @param {SubQuery} query
   * @return this
   */
  orWhereNotExists(query) {
    return this.whereNotExists(query, 'or')
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {String} operator
   * @param {String|Column} value
   * @param {String} bool
   * @param {Boolean} not
   * @return this
   */
  whereColumn(expr, operator, value, bool = 'and', not = false) {
    if ( value != null && operator == null ) {
      value = operator
      operator = '='
    }
    
    return this.where(expr, operator, this.ensureColumn(value), bool, not)
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {String} operator
   * @param {String|Column} value
   * @return this
   */
  orWhereColumn(first, operator, second) {
    return this.whereColumn(first, operator, second)
  }
  
  /**
   * 
   * @return Builder instance
   */
  newBuilder() {
    return new Builder
  }
  
  /**
   * 
   * @return Criteria instance
   */
  newCriteria() {
    return new Criteria
  }
  
  /**
   * 
   * @param {Query|Function} query
   * @return select query
   * @throws {TypeError}
   * @private
   */
  ensureSubQuery(query) {
    // accept a function as a parameter
    if ( isFunction(query) ) {
      let fn = query
      
      fn(query = this.newBuilder())
    }
    
    // accept a builder instance
    if ( query instanceof Builder )
      query = query.build()
    
    // accept a select query instance
    if ( query instanceof Select )
      query = new SubQuery(query)
    
    // throws an error for invalid argument
    if (! (query instanceof SubQuery) )
      throw new TypeError("Invalid sub query expression")
    
    return query
  }
  
  /**
   * 
   * @param {String|Raw} expr
   * @param {Array} bindings
   * @retrun raw expression
   * @throws {TypeError}
   * @private
   */
  ensureRaw(expr, bindings = []) {
    if ( isString(expr) )
      expr = new Raw(expr, bindings)
    
    if (! (expr instanceof Raw) )
      throw new TypeError("Invalid raw expression")
    
    return expr
  }
  
  /**
   * 
   * @param {String|Column} column
   * @return column expression
   * @throws {TypeError}
   * @private
   */
  ensureColumn(column) {
    if ( isString(column) )
      column = new Column(column)
    
    if ( column instanceof Column ) return column
    
    throw new TypeError("Invalid column expression")
  }
  
  /**
   * 
   * @param {String} method
   * @param {String} columns
   * @param {Boolean} distinct
   * @return this query
   * @private
   */
  selectAggregate(method, columns, distinct = false) {
    return this.select(new Aggregate(method, columns, distinct))
  }
  
}
