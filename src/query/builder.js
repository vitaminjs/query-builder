
import { Columns, Tables, Unions, Joins, Orders } from './components'
import Expression, { Raw as RawExpr, Column } from '../expression'
import Compiler, { createCompiler } from '../compiler'
import { isString, isArray, toArray } from 'lodash'
import { Criteria } from '../criterion'
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
    this._joins             = null
    this._tables            = null
    this._unions            = null
    this._groups            = null
    this._orders            = null
    this._columns           = null
    this._unionOrders       = null
    this._limit             = null
    this._offset            = null
    this._unionLimit        = null
    this._unionOffset       = null
    this._conditions        = null
    this._havingConditions  = null
    this._distinct          = false
    this._type              = SELECT_QUERY
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
      let sql = this.build().compile(dialect)
      let values = dialect.getBindings()

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
    return !( this._columns == null || this._columns.isEmpty() )
  }

  /**
   * 
   * @param {Columns} value
   * @returns {Builder}
   * @throws {TypeError}
   */
  setColumns(value) {
    if (! (value instanceof Columns) )
      throw new TypeError("Invalid builder columns")
    
    this._columns = value
    return this
  }

  /**
   * 
   * @returns {Columns}
   */
  getColumns() {
    if ( this._columns == null )
      this.resetColumns()
    
    return this._columns
  }

  /**
   * 
   * @returns {Builder}
   */
  resetColumns() {
    return this.setColumns(new Columns())
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
    return !( this._tables == null || this._tables.isEmpty() )
  }

  /**
   * 
   * @param {Tables} value
   * @returns {Builder}
   * @throws {TypeError}
   */
  setTables(value) {
    if (! (value instanceof Tables) )
      throw new TypeError("Invalid builder tables")
    
    this._tables = value
    return this
  }

  /**
   * 
   * @returns {Tables}
   */
  getTables() {
    if ( this._tables == null )
      this.resetTables()
    
    return this._tables
  }

  /**
   * 
   * @returns {Builder}
   */
  resetTables() {
    return this.setTables(new Tables())
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
    this.getGroups().add(...arguments)

    // by convention, select the group by columns
    this.getColumns().add(...arguments)
    
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasGroups() {
    return !( this._groups == null || this._groups.isEmpty() )
  }

  /**
   * 
   * @returns {Columns}
   */
  getGroups() {
    if ( this._groups == null )
      this.resetGroups()

    return this._groups
  }

  /**
   * 
   * @param {Columns} value
   * @returns {Builder}
   * @throws {TypeError}
   */
  setGroups(value) {
    if (! (value instanceof Columns) )
      throw new TypeError("Invalid builder groups")

    this._groups = value
    return this
  }
  
  /**
   * 
   * @returns {Builder}
   */
  resetGroups() {
    return this.setGroups(new Columns())
  }
  
  /**
   * 
   * @param {Array} columns
   * @returns {Builder}
   */
  orderBy(columns) {
    this.getOrders().add(...arguments)
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasOrders() {
    return !( this._orders == null || this._orders.isEmpty() )
  }

  /**
   * 
   * @param {Orders} value
   * @returns {Builder}
   * @throws {TypeError}
   */
  setOrders(value) {
    if (! (value instanceof Orders) )
      throw new TypeError("Invalid builder orders")
    
    this._orders = value
    return this
  }

  /**
   * 
   * @returns {Orders}
   */
  getOrders() {
    if ( this._orders == null )
      this.resetOrders()

    return this._orders
  }

  /**
   * 
   * @returns {Builder}
   */
  resetOrders() {
    return this.setOrders(new Orders())
  }

  /**
   * 
   * @param {Array} columns
   * @returns {Builder}
   */
  unionOrderBy(columns) {
    this.getUnionOrders().add(...arguments)
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasUnionOrders() {
    return !( this._unionOrders == null || this._unionOrders.isEmpty() )
  }

  /**
   * 
   * @param {Orders} value
   * @returns {Builder}
   * @throws {TypeError}
   */
  setUnionOrders(value) {
    if (! (value instanceof Orders) )
      throw new TypeError("Invalid builder orders")
    
    this._unionOrders = value
    return this
  }

  /**
   * 
   * @returns {Orders}
   */
  getUnionOrders() {
    if ( this._orders == null )
      this.resetUnionOrders()

    return this._unionOrders
  }

  /**
   * 
   * @returns {Builder}
   */
  resetUnionOrders() {
    return this.setUnionOrders(new Orders())
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
    return !( this._unions == null || this._unions.isEmpty() )
  }

  /**
   * 
   * @param {Unions} value
   * @returns {Builder}
   * @throws {TypeError}
   */
  setUnions(value) {
    if (! (value instanceof Unions) )
      throw new TypeError("Invalid builder unions")
    
    this._unions = value
    return this
  }

  /**
   * 
   * @returns {Unions}
   */
  getUnions() {
    if ( this._unions == null )
      this.resetUnions()
    
    return this._unions
  }

  /**
   * 
   * @returns {Builder}
   */
  resetUnions() {
    return this.setUnions(new Unions())
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
    return !( this._joins == null || this._joins.isEmpty() )
  }

  /**
   * @param {Joins} value
   * @returns {Builder}
   * @throws {TypeError}
   */
  setJoins(value) {
    if (! (value instanceof Joins) )
      throw new TypeError("Invalid builder joins")
    
    this._joins = value
    return this
  }

  /**
   * 
   * @returns {Joins}
   */
  getJoins() {
    if ( this._joins == null )
      this.resetJoins()
    
    return this._joins
  }

  /**
   * 
   * @returns {Builder}
   */
  resetJoins() {
    return this.setJoins(new Joins())
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
    this.getConditions().where(expr, operator, value, bool, not)
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
    this.getConditions().whereNot(expr, operator, value, bool)
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
   * @param {String|Column} first
   * @param {String} operator
   * @param {String|Column} second
   * @param {String} bool
   * @param {Boolean} not
   * @returns {Builder}
   */
  whereColumn(first, operator, second, bool = 'and') {
    this.getConditions().on(first, operator, second, bool)
    return this
  }
  
  /**
   * 
   * @param {String|Column} first
   * @param {String} operator
   * @param {String|Column} second
   * @returns {Builder}
   */
  orWhereColumn(first, operator, second) {
    return this.whereColumn(first, operator, second, 'or')
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasConditions() {
    return !( this._conditions == null || this._conditions.isEmpty() )
  }

  /**
   * 
   * @param {Criteria} value
   * @returns {Builder}
   */
  setConditions(value) {
    this._conditions = value
    return this
  }

  /**
   * 
   * @returns {Builder}
   */
  resetConditions() {
    return this.setConditions(new Criteria())
  }

  /**
   * 
   * @returns {Criteria}
   */
  getConditions() {
    if ( this._conditions == null )
      this.resetConditions()

    return this._conditions
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
    this._havingConditions.where(expr, operator, value, bool, not)
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
   * @returns {Boolean}
   */
  hasHavingConditions() {
    return !( this._havingConditions == null || this._havingConditions.isEmpty() )
  }

  /**
   * 
   * @param {Criteria} value
   * @returns {Builder}
   */
  setHavingConditions(value) {
    this._havingConditions = value
    return this
  }

   /**
   * 
   * @returns {Builder}
   */
  resetHavingConditions() {
    return this.setHavingConditions(new Criteria())
  }

  /**
   * 
   * @returns {Criteria}
   */
  getHavingConditions() {
    return this._havingConditions
  }
  
}
