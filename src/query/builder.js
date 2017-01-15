
import Expression, { Join, Aggregate, Order, Raw as RawExpr, Column } from '../expression'
import Compiler, { createCompiler } from '../compiler'
import { isString, isArray, toArray } from 'lodash'
import { Columns, Tables, Unions, Joins } from './components'
import Criteria from '../criterion/criteria'
import { createQuery } from '.'
import { SQ } from '../helpers'

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
    this.joins        = null
    this.tables       = null
    this.unions       = null
    this.groups       = []
    this.orders       = []
    this.columns      = null
    this.unionOrders  = []
    
    this._limit       = null
    this._offset      = null
    this._unionLimit  = null
    this._unionOffset = null
    this._distinct    = false
    this._type        = SELECT_QUERY
    
    this.conditions       = new Criteria()
    this.havingConditions = new Criteria()
  }
  
  /**
   * 
   * @returns {Query}
   */
  build() {
    return createQuery(this._type, this)
  }
  
  /**
   * 
   * @param {String|Compiler} dialect
   * @throws {TypeError}
   * @returns {Object}
   */
  compile(dialect) {
    if ( isString(dialect) )
      dialect = createCompiler(dialect)
    
    if ( dialect instanceof Compiler ) {
      var sql = this.build().compile(dialect)
      var values = dialect.getBindings()

      return { sql, values }
    }
    
    throw new TypeError("Invalid query compiler")
  }
  
  /**
   * 
   * @param {Array} columns
   * @returns {Builder}
   */
  select(columns) {
    this.getColumns().add(...arguments)
    return this
  }
  
  /**
   * 
   * @returns {Boolean}
   */
  hasColumns() {
    return !(this.columns == null || this.columns.isEmpty())
  }

  /**
   * 
   * @param {Columns} value
   * @returns {Builder}
   */
  setColumns(value) {
    if (! (value instanceof Columns) )
      throw new TypeError("Invalid builder columns")
    
    this.columns = value
    return this
  }

  /**
   * 
   * @returns {Columns}
   */
  getColumns() {
    if ( this.columns == null )
      this.columns = new Columns()
    
    return this.columns
  }
  
  /**
   * 
   * @param {Array} columns
   * @returns {Builder}
   */
  unselect(columns) {
    this.getColumns().remove(columns)
    return this
  }
  
  /**
   * 
   * @param {Boolean} flag
   * @returns {Builder}
   */
  distinct(flag = true) {
    this._distinct = flag
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  isDistinct() {
    return this._distinct
  }
  
  /**
   * 
   * @param {Array} value
   * @returns {Builder}
   */
  from(tables) {
    this.getTables().add(...arguments)
    return this
  }
  
  /**
   * 
   * @returns {Boolean}
   */
  hasTables() {
    return !(this.tables == null || this.tables.isEmpty())
  }

  /**
   * 
   * @param {Tables} value
   * @returns {Builder}
   */
  setTables(value) {
    if (! (value instanceof Tables) )
      throw new TypeError("Invalid builder tables")
    
    this.tables = value
    return this
  }

  /**
   * 
   * @returns {Tables}
   */
  getTables() {
    if ( this.tables == null )
      this.tables = new Tables()
    
    return this.tables
  }
  
  /**
   * 
   * @param {Integer} value
   * @returns {Builder}
   */
  limit(value) {
    if ( (value = parseInt(value, 10)) > 0 )
      this._limit = value
    
    return this
  }

  /**
   * 
   * @param {Integer} value
   * @returns {Builder}
   */
  unionLimit(value) {
    if ( (value = parseInt(value, 10)) > 0 )
      this._unionLimit = value
    
    return this
  }

  /**
   * 
   * @returns {Number|null}
   */
  getLimit() {
    return this._limit
  }

  /**
   * 
   * @returns {Builder}
   */
  resetLimit() {
    this._limit = null
    return this
  }

  /**
   * 
   * @returns {Number|null}
   */
  getUnionLimit() {
    return this._unionLimit
  }

  /**
   * 
   * @returns {Builder}
   */
  resetUnionLimit() {
    this._unionLimit = null
    return this
  }
  
  /**
   * 
   * @param {Integer} value
   * @returns {Builder}
   */
  offset(value) {
    if ( (value = parseInt(value, 10)) > 0 )
      this._offset = value
    
    return this
  }

  /**
   * 
   * @param {Integer} value
   * @returns {Builder}
   */
  unionOffset(value) {
    if ( (value = parseInt(value, 10)) > 0 )
      this._unionLimit = value
    
    return this
  }

  /**
   * 
   * @returns {Number|null}
   */
  getOffset() {
    return this._offset
  }

  /**
   * 
   * @returns {Number|null}
   */
  getUnionOffset() {
    return this._unionOffset
  }

  /**
   * 
   * @returns {Builder}
   */
  resetOffset() {
    this._offset = null
    return this
  }

  /**
   * 
   * @returns {Builder}
   */
  resetUnionOffset() {
    this._unionOffset = null
    return this
  }
  
  /**
   * 
   * @param {Array} columns
   * @returns {Builder}
   */
  groupBy(columns) {
    if (! isArray(columns) ) columns = toArray(arguments)
    
    columns.forEach(value => {
      // select the group by column by convention
      this.getColumns().add(value)
      
      this.groups.push(value)
    })
    
    return this
  }

  /**
   * 
   * @returns {Array}
   */
  getGroups() {
    return this.groups.slice()
  }

  /**
   * 
   * @param {Array} value
   * @returns {Builder}
   */
  setGroups(value) {
    this.groups = value
    return this
  }
  
  /**
   * 
   * @param {Array} columns
   * @returns {Builder}
   */
  orderBy(columns) {
    if (! isArray(columns) ) columns = toArray(arguments)
    
    columns.forEach(value => {
      if ( isString(value) )
        value = new Order(value)
      
      if (! (value instanceof Expression) )
        throw new TypeError("Invalid order expression")
      
      this.orders.push(value)
    })
    
    return this
  }

  /**
   * 
   * @param {Array} columns
   * @returns {Builder}
   */
  unionOrderBy(columns) {
    if (! isArray(columns) ) columns = toArray(arguments)
    
    columns.forEach(value => {
      if ( isString(value) )
        value = new Order(value)
      
      if (! (value instanceof Expression) )
        throw new TypeError("Invalid union order by expression")
      
      this.unionOrders.push(value)
    })
    
    return this
  }

  /**
   * 
   * @returns {Array}
   */
  getOrders() {
    return this.orders.slice()
  }

  /**
   * 
   * @returns {Array}
   */
  getUnionOrders() {
    return this.unionOrders.slice()
  }
  
  /**
   * 
   * @param {Any} query
   * @param {Boolean} all
   * @returns {Builder}
   */
  union(query, all = false) {
    this.getUnions().add(SQ(query), all)
    return this
  }
  
  /**
   * 
   * @param {Any} query
   * @returns {Builder}
   */
  unionAll(query) {
    return this.union(query, true)
  }
  
  /**
   * 
   * @returns {Boolean}
   */
  hasUnions() {
    return !(this.unions == null || this.unions.isEmpty())
  }

  /**
   * 
   * @param {Unions} value
   * @returns {Builder}
   */
  setUnions(value) {
    if (! (value instanceof Unions) )
      throw new TypeError("Invalid builder unions")
    
    this.unions = value
    return this
  }

  /**
   * 
   * @returns {Unions}
   */
  getUnions() {
    if ( this.unions == null )
      this.unions = new Unions()
    
    return this.unions
  }
  
  /**
   * 
   * @param {Any} table
   * @param {Any} first
   * @param {String} operator
   * @param {Any} second
   * @param {String} type
   * @returns {Builder}
   */
  join(table, first, operator, second, type = 'inner') {
    var criteria = null
    
    // handle raw expressions
    if ( table instanceof RawExpr ) {
      this.getJoins().push(table)
      return this
    }
    
    // add the join criteria object
    if ( first != null ) {
      criteria =  new Criteria()
      
      if ( second != null && operator == null ) {
        second = operator
        operator = '='
      }
      
      // usually, a join clause compare between 2 columns
      if ( isString(second) )
        second = new Column(second)
      
      criteria.where(first, operator, second)
    }
    
    this.getJoins().add(table, type, criteria)
    
    return this
  }
  
  /**
   * 
   * @param {String} table
   * @param {String} first
   * @param {String} operator
   * @param {String} second
   * @param {String} type
   * @returns {Builder}
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
   * @returns {Builder}
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
   * @returns {Builder}
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
   * @returns {Builder}
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
   * @returns {Builder}
   */
  outerJoin(table, first, operator, second) {
    return this.join(table, first, operator, second, 'outer')
  }
  
  /**
   * 
   * @returns {Boolean}
   */
  hasJoins() {
    return !(this.joins == null || this.joins.isEmpty())
  }

  /**
   * @param {Joins} value
   * @returns {Builder}
   */
  setJoins(value) {
    if (! (value instanceof Joins) )
      throw new TypeError("Invalid builder joins")
    
    this.joins = value
    return this
  }

  /**
   * 
   * @returns {Joins}
   */
  getJoins() {
    if ( this.joins == null )
      this.joins = new Joins()
    
    return this.joins
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @param {Boolean} not
   * @returns {Builder}
   */
  where(expr, operator, value, bool = 'and', not = false) {
    this.conditions.where(expr, operator, value, bool, not)
    return this
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {Boolean} not
   * @returns {Builder}
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
   * @returns {Builder}
   */
  whereNot(expr, operator, value, bool = 'and') {
    this.conditions.whereNot(expr, operator, value, bool)
    return this
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @returns {Builder}
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
   * @returns {Builder}
   */
  whereBetween(expr, values, bool = 'and', not = false) {
    this.conditions.between(expr, values, bool, not)
    return this
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {Array} values
   * @returns {Builder}
   */
  orWhereBetween(expr, values) {
    return this.whereBetween(expr, values, 'or')
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {Array} values
   * @param {String} bool
   * @returns {Builder}
   */
  whereNotBetween(expr, values, bool = 'and') {
    return this.whereBetween(expr, values, bool, true)
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {Array} values
   * @returns {Builder}
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
   * @returns {Builder}
   */
  whereIn(expr, values, bool = 'and', not = false) {
    this.conditions.in(expr, values, bool, not)
    return this
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {Any} values
   * @returns {Builder}
   */
  orWhereIn(expr, values) {
    return this.whereIn(expr, values, 'or')
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {Any} values
   * @param {String} bool
   * @returns {Builder}
   */
  whereNotIn(expr, values, bool = 'and') {
    return this.whereIn(expr, values, bool, true)
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {Any} values
   * @returns {Builder}
   */
  orWhereNotIn(expr, values) {
    return this.whereNotIn(expr, values, 'or')
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {String} bool
   * @param {Boolean} not
   * @returns {Builder}
   */
  whereNull(expr, bool = 'and', not = false) {
    this.conditions.isNull(expr, bool, not)
    return this
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @returns {Builder}
   */
  orWhereNull(expr) {
    return this.whereNull(expr, 'or')
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {String} bool
   * @returns {Builder}
   */
  whereNotNull(expr, bool = 'and') {
    return this.whereNull(expr, bool, true)
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @returns {Builder}
   */
  orWhereNotNull(expr) {
    return this.whereNotNull(expr, 'or')
  }
  
  /**
   * 
   * @param {SubQuery} query
   * @param {String} bool
   * @param {Boolean} not
   * @returns {Builder}
   */
  whereExists(query, bool = 'and', not = false) {
    this.conditions.exists(query, bool, not)
    return this
  }
  
  /**
   * 
   * @param {SubQuery} query
   * @returns {Builder}
   */
  orWhereExists(query) {
    return this.whereExists(query, 'or')
  }
  
  /**
   * 
   * @param {SubQuery} query
   * @param {String} bool
   * @returns {Builder}
   */
  whereNotExists(query, bool = 'and') {
    return this.whereExists(query, bool, true)
  }
  
  /**
   * 
   * @param {SubQuery} query
   * @returns {Builder}
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
   * @returns {Builder}
   */
  whereColumn(expr, operator, value, bool = 'and') {
    this.conditions.on(expr, operator, value, bool)
    return this
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {String} operator
   * @param {String|Column} value
   * @returns {Builder}
   */
  orWhereColumn(first, operator, second) {
    return this.whereColumn(first, operator, second, 'or')
  }

  /**
   * 
   * @param {Criteria} value
   * @returns {Builder}
   */
  setConditions(value) {
    this.conditions = value
    return this
  }

  /**
   * 
   * @returns {Builder}
   */
  resetConditions() {
    this.conditions = new Criteria()
    return this
  }

  /**
   * 
   * @returns {Criteria}
   */
  getConditions() {
    return this.conditions
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @param {Boolean} not
   * @returns {Builder}
   */
  having(expr, operator, value, bool = 'and', not = false) {
    this.havingConditions.where(expr, operator, value, bool, not)
    return this
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @returns {Builder}
   */
  orHaving(expr, operator, value) {
    return this.having(expr, operator, value, 'or')
  }

  /**
   * 
   * @param {Criteria} value
   * @returns {Builder}
   */
  setHavingConditions(value) {
    this.havingConditions = value
    return this
  }

   /**
   * 
   * @returns {Builder}
   */
  resetHavingConditions() {
    this.havingConditions = new Criteria()
    return this
  }

  /**
   * 
   * @returns {Criteria}
   */
  getHavingConditions() {
    return this.havingConditions
  }
  
}
