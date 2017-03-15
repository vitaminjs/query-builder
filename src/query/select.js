
import Expression, { Literal, SubQuery, Join } from '../expression'
import { isString, isFunction, clone } from 'lodash'
import { UseConditions } from './mixins'
import { Criteria } from '../criterion'
import Query from './base'

/**
 * 
 */
export default class Select extends UseConditions(Query) {

  constructor() {
    super()

    this._joins             = []
    this._tables            = []
    this._groups            = []
    this._orders            = []
    this._columns           = []
    this._limit             = null
    this._offset            = null
    this._havingConditions  = null
    this._distinct          = false
  }

  /**
   * 
   * @param {String} name
   * @returns {SubQuery}
   */
  as(name) {
    return this.toExpression().as(name)
  }

  /**
   * 
   * @returns {Select}
   */
  newQuery() {
    return new Select()
  }

  /**
   * 
   * @returns {SubQuery}
   */
  toExpression() {
    return new SubQuery(this)
  }

  /**
   * 
   * @returns {Select}
   */
  clone() {
    var query = new Select()

    this.isDistinct() && query.distinct()
    query.setOptions(clone(this.getOptions()))
    this.hasLimit() && query.limit(this.getLimit())
    this.hasOffset() && query.offset(this.getOffset())
    this.hasJoins() && query.setJoins(this.getJoins().slice())
    this.hasTables() && query.setTables(this.getTables().slice())
    this.hasGroups() && query.setGroups(this.getGroups().slice())
    this.hasOrders() && query.setOrders(this.getOrders().slice())
    this.hasColumns() && query.setColumns(this.getColumns().slice())
    this.hasConditions() && query.setConditions(this.getConditions().clone())
    this.hasHavingConditions() && query.setHavingConditions(this.getHavingConditions().clone())

    return query
  }

  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return (this.hasColumns() || this.hasTables()) ? compiler.compileSelectQuery(this) : ''
  }

  /**
   * 
   * @param {Any} columns
   * @returns {Select}
   */
  select(...columns) {
    for ( let value of columns )
      this.addColumn(value)
    
    return this
  }
  
  /**
   * 
   * @param {Any} value
   * @returns {Select}
   */
  addColumn(value) {
    this.getColumns().push(this.ensureExpression(value))
    return this
  }

  /**
   * 
   * @param {Array} value
   * @returns {Select}
   */
  setColumns(value) {
    this._columns = value
    return this
  }

  /**
   * 
   * @returns {Select}
   */
  resetColumns() {
    return this.setColumns([])
  }

  /**
   * 
   * @returns {Array}
   */
  getColumns() {
    return this._columns
  }
  
  /**
   * 
   * @returns {Boolean}
   */
  hasColumns() {
    return this._columns.length > 0
  }

  /**
   * 
   * @param {Boolean} flag
   * @returns {Select}
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
   * @param {Any} tables
   * @returns {Select}
   */
  from(...tables) {
    for ( let value of tables )
      this.addTable(value)

    return this
  }
  
  /**
   * 
   * @param {Any} value
   * @returns {Select}
   */
  addTable(value) {
    if ( isFunction(value) ) {
      let fn = value

      fn(value = this.newQuery())
    }

    if ( value instanceof Select )
      value = value.toExpression()
    
    this.getTables().push(this.ensureExpression(value))
    
    return this
  }
  
  /**
   * 
   * @returns {Boolean}
   */
  hasTables() {
    return this._tables.length > 0
  }

  /**
   * 
   * @param {Array} value
   * @returns {Select}
   */
  setTables(value) {
    this._tables = value
    return this
  }

  /**
   * 
   * @returns {Tables}
   */
  getTables() {
    return this._tables
  }

  /**
   * 
   * @returns {Select}
   */
  resetTables() {
    return this.setTables([])
  }
  
  /**
   * 
   * @param {Integer} value
   * @returns {Select}
   */
  limit(value) {
    this._limit = value
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasLimit() {
    return this._limit != null
  }

  /**
   * 
   * @returns {Integer}
   */
  getLimit() {
    return this._limit
  }

  /**
   * 
   * @returns {Select}
   */
  resetLimit() {
    this._limit = null
    return this
  }
  
  /**
   * 
   * @param {Integer} value
   * @returns {Select}
   */
  offset(value) {
    this._offset = value
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasOffset() {
    return this._offset != null
  }

  /**
   * 
   * @returns {Integer}
   */
  getOffset() {
    return this._offset
  }

  /**
   * 
   * @returns {Select}
   */
  resetOffset() {
    this._offset = null
    return this
  }

  /**
   * 
   * @param {Any} columns
   * @returns {Select}
   */
  groupBy(...columns) {
    for ( let value of columns )
      this.addGroup(value)
    
    return this
  }
  
  /**
   * 
   * @param {Any} value
   * @returns {Select}
   */
  addGroup(value) {
    this.getGroups().push(this.ensureExpression(value))
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasGroups() {
    return this._groups.length > 0
  }

  /**
   * 
   * @returns {Array}
   */
  getGroups() {
    return this._groups
  }

  /**
   * 
   * @param {Array} value
   * @returns {Select}
   */
  setGroups(value) {
    this._groups = value
    return this
  }
  
  /**
   * 
   * @returns {Select}
   */
  resetGroups() {
    return this.setGroups([])
  }
  
  /**
   * 
   * @param {Any} columns
   * @returns {Select}
   */
  orderBy(...columns) {
    for ( let value of columns )
      this.addOrder(value)

    return this
  }
  
  /**
   * 
   * @param {Any} value
   * @returns {Select}
   */
  addOrder(value) {
    this.getOrders().push(this.ensureExpression(value))
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasOrders() {
    return this._orders.length > 0
  }

  /**
   * 
   * @param {Array} value
   * @returns {Select}
   */
  setOrders(value) {
    this._orders = value
    return this
  }

  /**
   * 
   * @returns {Orders}
   */
  getOrders() {
    return this._orders
  }

  /**
   * 
   * @returns {Select}
   */
  resetOrders() {
    return this.setOrders([])
  }
  
  /**
   * 
   * @param {Any} table
   * @param {Any} condition
   * @returns {Select}
   */
  join(table, ...condition) {
    var criteria = null

    // handle raw expressions
    if ( table instanceof Literal ) {
      this.getJoins().push(table)
      return this
    }
      
    // add the join criteria object
    if ( first != null )
      criteria =  new Criteria().where(first, operator, second)
    
    return this.addJoin(table, 'inner', criteria)
  }
  
  /**
   * 
   * @param {Any} table
   * @param {String} type
   * @param {Criteria} criteria
   * @returns {Select}
   */
  addJoin(table, type = null, criteria = null) {
    // handle functions
    if ( isFunction(table) ) {
      let fn = table

      fn(table = this.newQuery())
    }

    // handle sub queries
    if ( table instanceof Select )
      table = table.toExpression()
    
    // TODO handle Join expressions
    
    this.getJoins().push(new Join(this.ensureExpression(table), type, criteria))

    return this
  }
  
  /**
   * 
   * @param {Any} table
   * @param {Any} first
   * @param {String} operator
   * @param {Any} second
   * @returns {Select}
   */
  innerJoin(table, first, operator, second) {
    // return this.join(table, first, operator, second)
  }
  
  /**
   * 
   * @param {Any} table
   * @param {Any} first
   * @param {String} operator
   * @param {Any} second
   * @returns {Select}
   */
  rightJoin(table, first, operator, second) {
    // return this.join(table, first, operator, second, 'right')
  }
  
  /**
   * 
   * @param {Any} table
   * @param {Any} first
   * @param {String} operator
   * @param {Any} second
   * @returns {Select}
   */
  leftJoin(table, first, operator, second) {
    // return this.join(table, first, operator, second, 'left')
  }
  
  /**
   * 
   * @param {Any} table
   * @returns {Select}
   */
  crossJoin(table) {
    return this.addJoin(this.ensureExpression(table), 'cross')
  }
  
  /**
   * 
   * @returns {Boolean}
   */
  hasJoins() {
    return this._joins.length > 0
  }

  /**
   * @param {Array} value
   * @returns {Select}
   */
  setJoins(value) {
    this._joins = value
    return this
  }

  /**
   * 
   * @returns {Array}
   */
  getJoins() {
    return this._joins
  }

  /**
   * 
   * @returns {Select}
   */
  resetJoins() {
    return this.setJoins([])
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {Any} args
   * @returns {Select}
   */
  having(expr, ...args) {
    this.getHavingConditions().where(...arguments)
    return this
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {Any} args
   * @returns {Select}
   */
  orHaving(expr, ...args) {
    return this.having(...arguments)
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
   * @returns {Select}
   */
  setHavingConditions(value) {
    this._havingConditions = value
    return this
  }

   /**
   * 
   * @returns {Select}
   */
  resetHavingConditions() {
    return this.setHavingConditions(new Criteria())
  }

  /**
   * 
   * @returns {Criteria}
   */
  getHavingConditions() {
    if ( this._havingConditions == null )
      this.resetHavingConditions()

    return this._havingConditions
  }

}