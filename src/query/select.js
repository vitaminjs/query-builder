
import Expression, { Literal, SubQuery, Join } from '../expression'
import { isString, isFunction, clone } from 'lodash'
import { UseConditions } from './mixins'
import { Criteria } from '../criterion'
import Query from './base'

// a DRY mixin for select query
const QueryMixin = UseConditions(UseConditions(Query, 'havingConditions', 'having'))

/**
 * 
 */
export default class Select extends QueryMixin {

  constructor() {
    super()

    this._joins             = []
    this._tables            = []
    this._groups            = []
    this._orders            = []
    this._columns           = []
    this._limit             = null
    this._offset            = null
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
   * @param {Any} key criterion operand
   * @param {Any} value criterion value
   * @param {String} type
   * @returns {Select}
   */
  join(table, key, value, type = 'inner') {
    var criteria = null

    // add the join criteria object
    if ( key != null )
      criteria =  new Criteria().where(key, value)
    
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
    // handle raw expressions
    if ( table instanceof Literal ) {
      this.getJoins().push(table)
      return this
    }
      
    // handle functions
    if ( isFunction(table) ) {
      let fn = table

      fn(table = this.newQuery())
    }

    // handle sub queries
    if ( table instanceof Select )
      table = table.toExpression()
    
    // handle Join expressions
    if (! (table instanceof Join) )
      table = new Join(this.ensureExpression(table), type, criteria)
    
    this.getJoins().push(table)

    return this
  }
  
  /**
   * 
   * @param {Any} table
   * @param {Any} key criterion operand
   * @param {Any} value criterion value
   * @returns {Select}
   */
  innerJoin(table, key, value) {
    return this.join(table, key, value)
  }
  
  /**
   * 
   * @param {Any} table
   * @param {Any} key criterion operand
   * @param {Any} value criterion value
   * @returns {Select}
   */
  rightJoin(table, key, value) {
    return this.join(table, key, value, 'right')
  }
  
  /**
   * 
   * @param {Any} table
   * @param {Any} key criterion operand
   * @param {Any} value criterion value
   * @returns {Select}
   */
  leftJoin(table, key, value) {
    return this.join(table, key, value, 'left')
  }
  
  /**
   * 
   * @param {Any} table
   * @returns {Select}
   */
  crossJoin(table) {
    return this.addJoin(table, 'cross')
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

}