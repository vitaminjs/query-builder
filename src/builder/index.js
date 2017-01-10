
import Expression, { Raw, Join, Aggregate, SubQuery, Order, Column, Table, Union } from '../expression'
import { isString, isArray, isFunction, toArray, remove } from 'lodash'
import Compiler, { createCompiler } from './compiler'
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
    columns.forEach(col => remove(this.columns, c => c.isEqual(col))
    
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
    
    if ( first != null ) {
      // TODO
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
   * @return Builder instance
   */
  newBuilder() {
    return new Builder
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
