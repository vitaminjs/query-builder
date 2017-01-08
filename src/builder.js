import Criteria from './criteria'
import { createCompiler } from './compiler'
import { Raw, Column, Aggregate } from './expression'
import { isArray, isFunction, isString, toArray, remove } from 'lodash'

/**
 * @class QueryBuilder
 */
export default class QueryBuilder {
  
  /**
   * 
   * @param {String} dialect
   * @constructor
   */
  constructor(dialect) {
    this.query = {
      joins: [],
      groups: [],
      orders: [],
      tables: [],
      wheres: [],
      unions: [],
      columns: [],
      havings: [],
      limit: null,
      offset: null,
      distinct: false,
      unionOrders: [],
      unionLimit: null,
      unionOffset: null,
    }
    
    this.name = null
    this.type = 'select'
    this.dialect = dialect
  }
  
  /**
   * 
   * @type boolean
   */
  hasUnions() {
    return this.query.unions.length > 0
  }
  
  /**
   * Compile to SQL
   * 
   * @return plain object
   */
  compile() {
    var compiler = createCompiler(this.dialect)
    
    switch ( this.type ) {
      case 'select':
        return compiler.compileSelect(this.query)
      
      case 'insert':
      
      case 'update':
      
      case 'delete':
    }
    
    throw new TypeError("Unknown compilation method")
  }
  
  /**
   * @type {String}
   */
  toString() {
    return this.compile().sql
  }
  
  /**
   * 
   * @return QueryBuilder instance
   */
  newQuery() {
    return new QueryBuilder(this.dialect)
  }
  
  /**
   * 
   * @return Criteria instance
   */
  newCriteria() {
    return new Criteria(this)
  }
  
  /**
   * Add columns to the query
   * 
   * @param {Any} columns
   * @return this query builder
   */
  select(columns) {
    if (! isArray(columns) ) columns = toArray(arguments)
    
    columns.forEach(col => this.query.columns.push(col))
    
    return this
  }
  
  /**
   * Add distinct columns to the query
   * 
   * @param {Any} columns
   * @return this query builder
   */
  selectDistinct(columns) {
    return this.select(...arguments).distinct()
  }
  
  /**
   * Set the query columns
   * 
   * @param {Array} columns
   * @return this query
   */
  setColumns(columns) {
    this.query.columns = []
    return this.select(...arguments)
  }
  
  /**
   * 
   * @param {Boolean} flag
   * @return this query builder
   */
  distinct(flag = true) {
    this.query.distinct = flag
    return this
  }
  
  /**
   * 
   * @param {Any} table
   * @param {String} alias
   * @return this query builder
   */
  from(table, alias = null) {
    if ( isString(table) )
      table += isString(alias) ? ' as ' + alias : ''
    else
      table = this._wrappedQuery(table).as(alias)
    
    this.query.tables.push(table)
    
    return this
  }
  
  /**
   * 
   * @param {Any} table
   * @param {String} alias
   * @return this query builder
   */
  setFrom(table, alias = null) {
    this.query.tables = []
    return this.from(table, alias)
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
      query = new Raw(query).wrap()
    
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
   * @param {Any} query
   * @param {Boolean} all
   * @return this query builder
   */
  union(query, all = false) {
    if ( isString(query) )
      query = new Raw(query).wrap()
    else
      query = this._wrappedQuery(query)
    
    // ensure query is a raw expression
    if (! (query instanceof Raw) )
      throw new TypeError("Invalid union query")
    
    // add the union query to the list
    this.query.unions.push({ query, all })
    
    return this
  }
  
  /**
   * 
   * @param {Any} query
   * @return this query builder
   */
  unionAll(query) {
    return this.union(query, true)
  }
  
  /**
   * 
   * @param {Any} query
   * @param {Boolean} all
   * @return this query builder
   */
  setUnion(query, all = false) {
    this.query.unions = []
    this.query.unionOrders = []
    this.query.unionLimit = null
    this.query.unionOffset = null
    
    return this.union(query, all)
  }
  
  /**
   * 
   * 
   * @param {Integer} value
   * @return this query
   */
  limit(value) {
    if ( (value = parseInt(value, 10)) > 0 )
      this.query[this.hasUnions() ? 'unionLimit' : 'limit'] = value
    
    return this
  }
  
  /**
   * 
   * 
   * @param {Integer} value
   * @return this query
   */
  offset(value) {
    if ( (value = parseInt(value, 10)) >= 0 )
      this.query[this.hasUnions() ? 'unionOffset' : 'offset'] = value
    
    return this
  }
  
  /**
   * 
   * @param {String} table
   * @param {String} first
   * @param {String} operator
   * @param {String} second
   * @param {String} type
   * @return this query builder
   */
  setJoin(table, first, operator, second, type = 'inner') {
    this.query.joins = []
    return this.join(table, first, operator, second, type)
  }
  
  /**
   * 
   * @param {String} table
   * @param {String} first
   * @param {String} operator
   * @param {String} second
   * @param {String} type
   * @return this query builder
   */
  join(table, first, operator, second, type = 'inner') {
    var criteria = null
    
    if ( first != null ) {
      criteria = this.newCriteria()
      
      if ( isString(first) )
        criteria.whereColumn(first, operator, second)
      else
        criteria.where(first, operator, second)
    }
    
    this.query.joins.push({ table, criteria, type })
    
    return this
  }
  
  /**
   * 
   * @param {String|Raw} expr
   * @param {Array} bindings
   * @return this query builder
   */
  joinRaw(expr, bindings = []) {
    this.query.joins.push(this._wrappedRaw(expr, bindings))
    return this
  }
  
  /**
   * 
   * @param {String} table
   * @param {String} first
   * @param {String} operator
   * @param {String} second
   * @return this query builder
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
   * @return this query builder
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
   * @return this query builder
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
   * @return this query builder
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
   * @return this query builder
   */
  outerJoin(table, first, operator, second) {
    return this.join(table, first, operator, second, 'outer')
  }
  
  /**
   * 
   * @param {Any} column
   * @param {String} operator
   * @param {Any} value
   * @param {String} prefix
   * @param {Boolean} negate
   * @return this query builder
   */
  where(column, operator, value, prefix = 'and', negate = false) {
    this.query.wheres.push(this.newCriteria().where(...arguments))
    return this
  }
  
  andWhere(column, operator, value) {
    return this.where(column, operator, value)
  }
  
  orWhere(column, operator, value) {
    return this.where(column, operator, value, 'or')
  }
  
  whereNot(column, operator, value) {
    return this.where(column, operator, value, 'and', true)
  }
  
  andWhereNot(column, operator, value) {
    return this.whereNot(column, operator, value)
  }
  
  orWhereNot(column, operator, value) {
    return this.where(column, operator, value, 'or', true)
  }
  
  whereBetween(column, value, prefix = 'and', negate = true) {
    this.query.wheres.push(this.newCriteria().whereBetween(...arguments))
    return this
  }
  
  andWhereBetween(column, value) {
    return this.whereBetween(column, value)
  }
  
  orWhereBetween(column, value) {
    return this.whereBetween(column, value, 'or')
  }
  
  whereNotBetween(column, value) {
    return this.whereBetween(column, value, 'and', true)
  }
  
  andWhereNotBetween(column, value) {
    return this.whereNotBetween(column, value)
  }
  
  orWhereNotBetween(column, value) {
    return this.whereBetween(column, value, 'or', true)
  }
  
  whereLike(column, value, prefix = 'and', negate = false) {
    this.query.wheres.push(this.newCriteria().whereLike(...arguments))
    return this
  }
  
  whereContains(column, value, prefix = 'and', negate = false) {
    return this.whereLike(column, `%${value}%`, prefix, negate)
  }
  
  whereStartsWith(column, value, prefix = 'and', negate = false) {
    return this.whereLike(column, `%${value}`, prefix, negate)
  }
  
  whereEndsWith(column, value, prefix = 'and', negate = false) {
    return this.whereLike(column, `${value}%`, prefix, negate)
  }
  
  andWhereLike(column, value) {
    return this.whereLike(column, value)
  }
  
  andWhereContains(column, value) {
    return this.whereContains(column, value)
  }
  
  andWhereStartsWith(column, value) {
    return this.whereStartsWith(column, value)
  }
  
  andWhereEndsWith(column, value) {
    return this.whereEndsWith(column, value)
  }
  
  orWhereLike(column, value) {
    return this.whereLike(column, value, 'or')
  }
  
  orWhereContains(column, value) {
    return this.whereContains(column, value, 'or')
  }
  
  orWhereStartsWith(column, value) {
    return this.whereStartsWith(column, value, 'or')
  }
  
  orWhereEndsWith(column, value) {
    return this.whereEndsWith(column, value, 'or')
  }
  
  whereNotLike(column, value) {
    return this.whereLike(column, value, 'and', true)
  }
  
  whereDoesntContain(column, value) {
    return this.whereContains(column, value, 'and', true)
  }
  
  whereDoesntStartWith(column, value) {
    return this.whereStartsWith(column, value, 'and', true)
  }
  
  whereDoesntEndWith(column, value) {
    return this.whereEndsWith(column, value, 'and', true)
  }
  
  andWhereNotLike(column, value) {
    return this.whereNotLike(column, value)
  }
  
  andWhereDoesntContain(column, value) {
    return this.whereDoesntContain(column, value)
  }
  
  andWhereDoesntStartWith(column, value) {
    return this.whereDoesntStartWith(column, value)
  }
  
  andWhereDoesntEndWith(column, value) {
    return this.whereDoesntEndWith(column, value)
  }
  
  orWhereNotLike(column, value) {
    return this.whereLike(column, value, 'or', true)
  }
  
  orWhereDoesntContain(column, value) {
    return this.whereContains(column, value, 'or', true)
  }
  
  orWhereDoesntStartWith(column, value) {
    return this.whereStartsWith(column, value, 'or', true)
  }
  
  orWhereDoesntEndWith(column, value) {
    return this.whereEndsWith(column, value, 'or', true)
  }
  
  whereIn(column, value, prefix = 'and', negate = false) {
    this.query.wheres.push(this.newCriteria().whereIn(...arguments))
    return this
  }
  
  andWhereIn(column, value) {
    return this.whereIn(column, value)
  }
  
  orWhereIn(column, value) {
    return this.whereIn(column, value, 'or')
  }
  
  whereNotIn(column, value) {
    return this.whereIn(column, value, 'and', true)
  }
  
  andWhereNotIn(column, value) {
    return this.whereNotIn(column, value)
  }
  
  orWhereNotIn(column, value) {
    return this.whereIn(column, value, 'or', true)
  }
  
  whereNull(column, prefix = 'and', negate = false) {
    this.query.wheres.push(this.newCriteria().whereNull(...arguments))
    return this
  }
  
  andWhereNull(column) {
    return this.whereNull(column)
  }
  
  orWhereNull(column) {
    return this.whereNull(column, 'or')
  }
  
  whereNotNull(column) {
    return this.whereNull(column, 'and', true)
  }
  
  andWhereNotNull(column) {
    return this.whereNotNull(column)
  }
  
  orWhereNotNull(column) {
    return this.whereNull(column, 'or', true)
  }
  
  whereRaw(expr, bindings = [], prefix = 'and') {
    this.query.wheres.push(this.newCriteria().whereRaw(...arguments))
    return this
  }
  
  andWhereRaw(expr, bindings = []) {
    return this.whereRaw(expr, bindings)
  }
  
  orWhereRaw(expr, bindings = []) { 
    return this.whereRaw(expr, bindings, 'or')
  }
  
  whereExists(value, prefix = 'and', negate = false) {
    this.query.wheres.push(this.newCriteria().whereExists(...arguments))
    return this
  }
  
  andWhereExists(value) {
    return this.whereExists(value)
  }
  
  orWhereExists(value) {
    return this.whereExists(value, 'or')
  }
  
  whereNotExists(value) {
    return this.whereExists(value, 'and', true)
  }
  
  andWhereNotExists(value) {
    return this.whereNotExists(value)
  }
  
  orWhereNotExists(value) {
    return this.whereExists(value, 'or', true)
  }
  
  whereColumn(first, operator, second, prefix = 'and') {
    this.query.wheres.push(this.newCriteria().whereColumn(...arguments))
    return this
  }
  
  andWhereColumn(first, operator, second) {
    return this.whereColumn(first, operator, second)
  }
  
  orWhereColumn(first, operator, second) {
    return this.whereColumn(first, operator, second, 'or')
  }
  
  whereSub(column, operator, value, prefix = 'and') {
    this.query.wheres.push(this.newCriteria().whereSub(...arguments))
    return this
  }
  
  andWhereSub(column, operator, value) {
    return this.whereSub(column, operator, value)
  }
  
  orWhereSub(column, operator, value) {
    return this.whereSub(column, operator, value, 'or')
  }
  
  whereScalar(scalar, operator, value, prefix = 'and') {
    this.query.wheres.push(this.newCriteria().whereScalar(...arguments))
    return this
  }
  
  andWhereScalar(scalar, operator, value) {
    return this.whereScalar(scalar, operator, value)
  }
  
  orWhereScalar(scalar, operator, value) {
    return this.whereScalar(scalar, operator, value, 'or')
  }
  
  /**
   * 
   * @param {Array} columns
   * @return this query
   */
  groupBy(columns) {
    if (! isArray(columns) ) columns = toArray(arguments)
    
    columns.forEach(col => this.query.groups.push(col))
    
    return this
  }
  
  /**
   * 
   * @param {Array} columns
   * @return this query builder
   */
  setGroups(columns) {
    this.query.groups = []
    return this.groupBy(...arguments)
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
   */
  setHavings(column, operator, value, prefix = 'and', negate = false) {
    this.query.havings = []
    return this.having(column, operator, value, prefix, negate)
  }
  
  /**
   * 
   */
  having(column, operator, value, prefix = 'and', negate = false) {
    this.query.havings.push(this.newCriteria().where(...arguments))
    return this
  }
  
  orHaving(column, operator, value) {
    return this.having(column, operator, value, 'or')
  }
  
  andHaving(column, operator, value) {
    return this.having(column, operator, value)
  }
  
  /**
   * 
   * @param {String} expr
   * @param {Array} bindings
   * @param {String} prefix
   * @return this query
   */
  havingRaw(expr, bindings = [], prefix = 'and') {
    this.query.havings.push(this.newCriteria().whereRaw(...arguments))
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
   * @param {Array} columns
   * @return this query
   */
  orderBy(columns) {
    if (! isArray(columns) ) columns = toArray(arguments)
    
    var orders = this.query[this.hasUnions() ? 'unionOrders' : 'orders']
    
    columns.forEach(column => {
      var direction = 'asc'
      
      // accept a desc direction using a minus prefix
      if ( isString(column) && column.indexOf('-') === 0 ) {
        column = column.substr(1)
        direction = 'desc'
      }
      
      orders.push({ column, direction })
    })
    
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
    var orders = this.query[this.hasUnions() ? 'unionOrders' : 'orders']
    
    orders.push(this._wrappedRaw(expr, bindings))
    
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
   * Convert the query builder to Raw instance
   * 
   * @return Raw object
   */
  toRaw() {
    var obj = this.compile()
    var raw = new Raw(obj.sql, obj.bindings)
    
    if ( this.name != null ) raw.wrap().as(this.name)
      
    return raw
  }
  
  /**
   * 
   * @param {String} name
   * @return 
   */
  as(name) {
    this.name = name
    return this
  }
  
  /**
   * 
   * 
   * @param {QueryBuilder|Function} value
   * @return Raw instance
   * @private
   */
  _wrappedQuery(value) {
    if ( isFunction(value) ) {
      let fn = value
      
      fn(value = this.newQuery())
    }
    
    if ( value instanceof QueryBuilder ) {
      value = value.toRaw().wrap()
    }
    
    return value
  }
  
  /**
   * 
   * @param {String|Raw} expr
   * @param {Array} bindings
   * @private
   */
  _wrappedRaw(expr, bindings = []) {
    if ( isString(expr) ) 
      expr = new Raw(expr, bindings)
    
    if ( expr instanceof Raw ) return expr
    
    throw new TypeError("Invalid raw expression")
  }
  
}