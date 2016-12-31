
import Raw from './raw'
import Criteria from './criteria'
import Aggregate from './aggregate'
import { createCompiler } from './compiler/factory'
import { isArray, isFunction, isEmpty, isString, isObject, toArray } from 'lodash'

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
    this.take = null
    this.skip = null
    this.wheres = []
    this.groups = []
    this.orders = []
    this.tables = []
    this.unions = []
    this.columns = []
    this.havings = []
    this.table = null
    this.alias = null
    this.isDistinct = false
    
    this.type = 'select'
    this.dialect = dialect
  }
  
  /**
   * @return plain object
   */
  compile() {
    return createCompiler(this.dialect).compile(this, this.type)
  }
  
  toString() {
    return this.compile().sql
  }
  
  newQuery() {
    return new QueryBuilder(this.dialect)
  }
  
  newCriteria() {
    return new Criteria(this)
  }
  
  /**
   * Add columns to the query
   * 
   * @param {Any} columns
   * @return this query
   */
  select(columns) {
    if (! isArray(columns) ) columns = toArray(arguments)
    
    if (! isEmpty(columns) ) this.columns.push(...columns)
    
    return this
  }
  
  /**
   * Add distinct columns to the query
   * 
   * @param {Any} columns
   * @return this query builder
   */
  selectDistinct(columns) {
    this.isDistinct = true
    return this.select(...arguments)
  }
  
  /**
   * Set the query columns
   * 
   * @param {Array} columns
   * @return this query
   */
  setColumns(columns) {
    this.columns = []
    return this.select(...arguments)
  }
  
  distinct(bool = true) {
    this.isDistinct = bool
    return this
  }
  
  /**
   * 
   * @param {Any} table
   * @param {String} alias
   * @return this query builder
   */
  from(table, alias = null) {
    if ( isString(table) ) table = { table, alias }
    else {
      table = this._wrappedQuery(table).as(alias)
    }
    
    this.tables.push(table)
    
    return this
  }
  
  /**
   * 
   * @param {Any} table
   * @param {String} alias
   * @return this query builder
   */
  setTables(table, alias = null) {
    this.tables = []
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
  
  where(column, operator, value, prefix = 'and', negate = false) {
    this.wheres.push(this.newCriteria().where(...arguments))
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
    this.wheres.push(this.newCriteria().whereBetween(...arguments))
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
    this.wheres.push(this.newCriteria().whereLike(...arguments))
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
    this.wheres.push(this.newCriteria().whereIn(...arguments))
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
    this.wheres.push(this.newCriteria().whereNull(...arguments))
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
    this.wheres.push(this.newCriteria().whereRaw(...arguments))
    return this
  }
  
  andWhereRaw(expr, bindings = []) {
    return this.whereRaw(expr, bindings)
  }
  
  orWhereRaw(expr, bindings = []) { 
    return this.whereRaw(expr, bindings, 'or')
  }
  
  whereExists(value, prefix = 'and', negate = false) {
    this.wheres.push(this.newCriteria().whereExists(...arguments))
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
    this.wheres.push(this.newCriteria().whereColumn(...arguments))
    return this
  }
  
  andWhereColumn(first, operator, second) {
    return this.whereColumn(first, operator, second)
  }
  
  orWhereColumn(first, operator, second) {
    return this.whereColumn(first, operator, second, 'or')
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
   * @param {QueryBuilder|Function} value
   * @return Raw instance
   */
  _wrappedQuery(value) {
    if ( isFunction(value) ) {
      let fn = value
      
      fn(value = this.newQuery())
    }
    
    if ( value instanceof QueryBuilder ) {
      let q = value.compile()
      
      value = new Raw(q.sql, q.bindings).wrap()
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
      expr = new Raw(expr, bindings)
    
    if ( expr instanceof Raw ) return expr
    
    throw new TypeError("Invalid raw expression")
  }
  
}