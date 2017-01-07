
import {
  compact, isEmpty, isObject, isArray, isString, isNumber, isUndefined
} from 'lodash'

import Aggregate from '../aggregate'
import Criteria from '../criteria'
import Column from '../column'
import Raw from '../raw'

/**
 * @class BaseCompiler
 */
export default class {
  
  /**
   * BaseCompiler constructor
   * 
   * @constructor
   */
  constructor() {
    this.bindings = []
  }
  
  /**
   * Default parameter placeholder
   */
  get parameter() {
    return '?'
  }
  
  /**
   * Compile a `select` query
   * 
   * @param {Object} query
   * @return plain object
   */
  compileSelect(query) {
    if ( isEmpty(query.columns) && isEmpty(query.tables) )
      return { sql: '', bindings: [] }
    
    var sql = this.compileSelectComponents(query)
    
    if (! isEmpty(query.unions) )
      sql = `(${sql}) ${this.compileUnionComponents(query)}`
    
    return { sql, bindings: this.bindings }
  }
  
  /**
   * 
   * @param {Object} query
   * @return string
   */
  compileSelectComponents(query) {
    var sql = [
      this.compileColumns(query.columns, query.distinct, query),
      this.compileTables(query.tables, query),
      this.compileJoins(query.joins, query),
      this.compileWheres(query.wheres, query),
      this.compileGroups(query.groups, query),
      this.compileHavings(query.havings, query),
      this.compileOrders(query.orders, query),
      this.compileLimit(query.limit, query),
      this.compileOffset(query.offset, query),
    ]
    
    return compact(sql).join(' ')
  }
  
  /**
   * 
   * @param {Object} query
   * @return string
   */
  compileUnionComponents(query) {
    var sql = [
      this.compileUnions(query.unions, query),
      this.compileOrders(query.unionOrders, query),
      this.compileLimit(query.unionLimit, query),
      this.compileOffset(query.unionOffset, query),
    ]
    
    return compact(sql).join(' ')
  }
  
  /**
   * Compile the query columns part
   * 
   * @param {Array} columns
   * @param {Boolean} isDistinct
   * @param {Object} query
   * @return string
   */
  compileColumns(columns, isDistinct, query) {
    var distinct = isDistinct ? 'distinct ' : ''
    
    if ( isEmpty(columns) ) columns = ['*']
    
    return 'select ' + distinct + this.columnize(columns)
  }
  
  /**
   * 
   * @param {Array} tables
   * @param {Object} query
   * @return string
   */
  compileTables(tables, query) {
    if ( isEmpty(tables) ) return
    
    return 'from ' + tables.map(table => this.escape(table)).join(', ')
  }
  
  /**
   * 
   * @param {Array} joins
   * @param {Object} query
   * @return string
   */
  compileJoins(joins, query) {
    if ( isEmpty(joins) ) return
    
    var sql = joins.map(join => {
      if ( join instanceof Raw ) return this.escape(join)
      
      var expr = join.type +' join '+ this.escape(join.table)
      
      if ( join.criteria )
        expr += ' on ' + this.compileCriteria(join.criteria).substr(4)
      
      return expr
    })
    
    return compact(sql).join(' ')
  }
  
  /**
   * 
   * @param {Array} wheres
   * @param {Object} query
   * @return string
   */
  compileWheres(wheres, query) {
    if ( isEmpty(wheres) ) return
    
    return 'where ' + this.compileConditions(wheres)
  }
  
  /**
   * 
   * @param {Array} groups
   * @param {Object} query
   * @return string
   */
  compileGroups(groups, query) {
    if ( isEmpty(groups) ) return
    
    return 'group by ' + this.columnize(groups)
  }
  
  /**
   * 
   * @param {Array} havings
   * @param {Object} query
   * @return string
   */
  compileHavings(havings, query) {
    if ( isEmpty(havings) ) return
    
    return 'having ' + this.compileConditions(havings)
  }
  
  /**
   * 
   * @param {Array} orders
   * @param {Object} query
   * @return string
   */
  compileOrders(orders, query) {
    if ( isEmpty(orders) ) return
    
    return 'order by ' + orders.map(order => {
      // escape raw expressions
      if ( order instanceof Raw ) return this.escape(order)
      
      return this.escape(order.column) + ' ' + order.direction
    }).join(', ')
  }
  
  /**
   * 
   * @param {Number} limit
   * @param {Object} query
   * @return string
   */
  compileLimit(limit, query) {
    if (! isNumber(limit) ) return
    
    return 'limit ' + this.parameterize(limit)
  }
  
  /**
   * 
   * @param {Number} offset
   * @param {Object} query
   * @return string
   */
  compileOffset(offset, query) {
    if (! isNumber(offset) ) return
    
    return 'offset ' + this.parameterize(offset)
  }
  
  /**
   * 
   * @param {Array} unions
   * @param {Object} query
   * @return string
   */
  compileUnions(unions, query) {
    if ( isEmpty(unions) ) return
    
    var sql = unions.map(obj => {
      var all = (obj.all ? 'all ' : '')
      var query = this.escape(obj.query)
      
      return `union ${all}${query}`
    })
    
    return compact(sql).join(' ')
  }
  
  /**
   * 
   * @param {Array} conditions
   * @return string
   */
  compileConditions(conditions = []) {
    return conditions.map(cr => this.compileCriteria(cr)).join(' ').substr(3).trim()
  }
  
  /**
   * 
   * @param {Criteria} criteria
   * @return string
   */
  compileCriteria(criteria) {
    return criteria.conditions.map(c => this.compileCriterion(c)).join(' ')
  }
  
  /**
   * 
   * @param {Object} criterion
   * @return string 
   */
  compileCriterion(criterion) {
    var column = criterion.column
    var bool = criterion.prefix + ' '
    
    // compile raw expressions
    if ( column instanceof Raw )
      return bool + this.escape(column)
    
    // compile nested criteria
    if ( column instanceof Criteria ) {
      let expr = this.compileCriteria(column)
      let not = criterion.negate ? 'not ' : ''
      
      return bool + `${not}(${expr.substr(3).trim()})`
    }
    
    switch ( criterion.operator ) {
      case 'is':
      case 'is not':
        return bool + this.compileWhereNull(criterion)
      
      case 'in':
      case 'not in':
        return bool + this.compileWhereIn(criterion)
      
      case 'exists':
      case 'not exists':
        return bool + this.compileWhereExists(criterion)
      
      case 'between':
      case 'not between':
        return bool + this.compileWhereBetween(criterion)
      
      default:
        return bool + this.compileBasicCriterion(criterion)
    }
  }
  
  /**
   * 
   * @param {Object} criterion
   * @return string
   */
  compileWhereNull(criterion) {
    var column = this.escape(criterion.column)
    var operator = this.operator(criterion.operator)
    
    return `${column} ${operator} null`
  }
  
  /**
   * 
   * @param {Object} criterion
   * @return string
   */
  compileWhereIn(criterion) {
    var operator = this.operator(criterion.operator)
    
    // return a boolean expression if the value is empty
    if ( isEmpty(criterion.value) )
      return '1 = ' + (operator === 'in' ? '0' : '1')
    
    var value = this.parameterize(criterion.value)
    var column = this.escape(criterion.column)
    
    return `${column} ${operator} (${value})`
  }
  
  /**
   * 
   * @param {Object} criterion
   * @return string
   */
  compileWhereExists(criterion) {
    var value = this.parameterize(criterion.value)
    var operator = this.operator(criterion.operator)
    
    return `${operator} (${value})`
  }
  
  /**
   * 
   * @param {Object} criterion
   * @return string
   */
  compileWhereBetween(criterion) {
    var column = this.escape(criterion.column)
    var value1 = this.parameterize(criterion.value[0])
    var value2 = this.parameterize(criterion.value[1])
    var operator = this.operator(criterion.operator)
    
    return `${column} ${operator} ${value1} and ${value2}`
  }
  
  /**
   * 
   * @param {Object} criterion
   * @return string
   */
  compileBasicCriterion(criterion) {
    var operator = this.operator(criterion.operator)
    var value = this.parameterize(criterion.value)
    var column = this.escape(criterion.column)
    var not = criterion.negate ? 'not ' : ''
    
    return `${not}${column} ${operator} ${value}`
  }
  
  /**
   * Compile a raw expression
   * 
   * @param {Raw} value
   * @return plain object
   */
  compileRaw(value) {
    var expr = value.expression.replace('?', this.parameter)
    var sql = this.alias(value.before + expr + value.after, value.name)
    
    return { sql, bindings: value.bindings }
  }
  
  /**
   * Check and return a valid operator
   * 
   * @param {String} value
   * @return string
   */
  operator(value) {
    return value || '='
  }
  
  /**
   * 
   * @param {Any} value
   * @return string
   */
  parameterize(value) {
    // escape raw expressions
    if ( value instanceof Raw )
      return this.escape(value)
    
    if ( value instanceof Column )
      return this.escape(value)
    
    if (! isArray(value) ) value = [value]
    
    // empty arrays are not accepted
    if ( isEmpty(value) )
      throw new TypeError("Invalid parameter value")
    
    return value.map(v => this.addBinding(v).parameter).join(', ')
  }
  
  /**
   * Add query binding value
   * 
   * @param {Any} value
   * @return this compiler
   */
  addBinding(value) {
    if ( isUndefined(value) || isObject(value) )
      throw new TypeError("Invalid parameter value")
    
    this.bindings.push(value)
    
    return this
  }
  
  /**
   * 
   * @param {Array} columns
   * @return string
   */
  columnize(columns) {
    if (! isArray(columns) ) columns = [columns]
    
    return columns.map(col => this.escape(col)).join(', ')
  }
  
  /**
   * Escape the given value
   * 
   * @param {String|Aggregate|Raw} value
   * @return string
   */
  escape(value) {
    var asIndex
    
    // escape raw expressions
    if ( value instanceof Raw )
      return this.escapeRaw(value)
    
    if ( value instanceof Column )
      value = value.toString()
    
    // escape aggregate columns
    if ( value instanceof Aggregate )
      return this.escapeAggregate(value)
    
    if (! isString(value) ) 
      throw new TypeError("Invalid value to escape")
    
    if ( (asIndex = value.toLowerCase().indexOf(' as ')) > 0 ) {
      let one = value.slice(0, asIndex)
      let two = value.slice(asIndex + 4)
      
      return this.alias(this.escape(one), two)
    }
    
    return value.split('.').map(str => this.escapeIdentifier(str)).join('.')
  }
  
  /**
   * Escape raw expression
   * 
   * @param {Raw} value
   * @return string
   */
  escapeRaw(value) {
    var query = this.compileRaw(value)
    
    // add raw bindings to the query bindings
    query.bindings.forEach(v => this.addBinding(v))
    
    return query.sql
  }
  
  /**
   * 
   * @param {Aggregate} value
   * @return string
   */
  escapeAggregate(value) {
    var column = this.columnize(value.column)
    var distinct = value.isDistinct ? 'distinct ' : ''
    
    // TODO ensure only valid aggregators
    
    return this.alias(`${value.method}(${distinct}${column})`, value.name)
  }
  
  /**
   * Escape the table or column name
   * 
   * @param {String} value
   * @return  string
   */
  escapeIdentifier(value) {
    return (value === '*') ? value : `"${value.trim().replace('"', '""')}"`
  }
  
  /**
   * Join two identifiers by `AS` clause
   * 
   * @param {String} first
   * @param {String} second
   * @return string
   */
  alias(first, second = null) {
    return first + (second ? ' as ' + this.escapeIdentifier(second) : '')
  }
  
}