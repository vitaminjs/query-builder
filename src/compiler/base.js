
import {
  compact, capitalize, flattenDeep, isEmpty, isFunction, isObject,
  isArray, isString, isNumber, isUndefined, isBoolean
} from 'lodash'

import Aggregate from '../aggregate'
import Criteria from '../criteria'
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
   * Compile the query builder
   * 
   * @param {QueryBuilder} qb
   * @param {String} method
   * @return plain object
   */
  compile(qb, method = 'select') {
    var sql = ''
    
    // reset the query bindings
    this.bindings = []
    
    switch ( method.toLowerCase() ) {
      case 'select':
        sql = this.compileSelect(qb)
        break
      
      case 'insert':
        
        break
      
      case 'update':
        
        break
      
      case 'delete':
        
        break
      
      default: throw new TypeError("Unknown compilation method")
    }
    
    return { sql, bindings: flattenDeep(this.bindings) }
  }
  
  /**
   * Compile a basic select query
   * 
   * @param {QueryBuilder} qb
   * @return string
   */
  compileSelect(qb) {
    if (! isEmpty(qb.unions) ) return this.compileCompoundSelect(qb)
    
    if ( isEmpty(qb.columns) && isEmpty(qb.tables) ) return ''
    
    var distinct = qb.isDistinct ? 'distinct ' : ''
    
    return `select ${distinct}${this.compileSelectComponents(qb)}`
  }
  
  /**
   * Compile a compound select query with unions
   * 
   * @param {QueryBuilder} qb
   * @return string
   */
  compileCompoundSelect(qb) {
    var sql = this.compileRaw(qb.getUnionSavePoint())
    
    return `(${sql}) ${this.compileCompoundSelectComponents(qb)}`
  }
  
  /**
   * 
   * @param {QueryBuilder} qb
   * @return string
   */
  compileSelectComponents(qb) {
    var sql = [
      this.compileColumns(qb),
      this.compileTables(qb),
      this.compileJoins(qb),
      this.compileWheres(qb),
      this.compileGroups(qb),
      this.compileHavings(qb),
      this.compileOrders(qb),
      this.compileLimit(qb),
      this.compileOffset(qb),
    ]
    
    return compact(sql).join(' ')
  }
  
  /**
   * 
   * @param {QueryBuilder} qb
   * @return string
   */
  compileCompoundSelectComponents(qb) {
    var sql = [
      this.compileUnions(qb),
      this.compileWheres(qb),
      this.compileGroups(qb),
      this.compileHavings(qb),
      this.compileOrders(qb),
      this.compileLimit(qb),
      this.compileOffset(qb),
    ]
    
    return compact(sql).join(' ')
  }
  
  /**
   * Compile the query columns part
   * 
   * @param {QueryBuilder} qb
   * @return string
   */
  compileColumns(qb) {
    return this.columnize(isEmpty(qb.columns) ? '*' : qb.columns)
  }
  
  /**
   * 
   * @param {QueryBuilder} qb
   * @return string
   */
  compileTables(qb) {
    if (! isEmpty(qb.tables) ) {
      return 'from ' + qb.tables.map(obj => {
        // escape raw expressions
        if ( obj instanceof Raw ) return this.compileRaw(obj)
        
        return this.alias(this.escape(obj.table), obj.alias)
      }).join(', ')
    }
  }
  
  /**
   * 
   * @param {QueryBuilder} qb
   * @return string
   */
  compileJoins(qb) {
    var joins = qb.joins.map(join => {
      if ( join instanceof Raw )
        return this.compileRaw(join)
      
      var expr = join.type +' join '+ this.escape(join.table)
      
      if ( join.criteria )
        expr += ' on ' + this.compileCriteria(join.criteria).substr(4)
      
      return expr
    })
    
    return compact(joins).join(' ')
  }
  
  /**
   * 
   * @param {QueryBuilder} qb
   * @return string
   */
  compileWheres(qb) {
    if (! isEmpty(qb.wheres) ) {
      return 'where ' + this.compileConditions(qb.wheres)
    }
  }
  
  /**
   * 
   * @param {QueryBuilder} qb
   * @return string
   */
  compileGroups(qb) {
    if (! isEmpty(qb.groups) ) 
      return 'group by ' + this.columnize(qb.groups)
  }
  
  /**
   * 
   * @param {QueryBuilder} qb
   * @return string
   */
  compileHavings(qb) {
    if (! isEmpty(qb.havings) ) {
      return 'having ' + this.compileConditions(qb.havings)
    }
  }
  
  /**
   * 
   * @param {QueryBuilder} qb
   * @return string
   */
  compileOrders(qb) {
    if (! isEmpty(qb.orders) ) {
      return 'order by ' + qb.orders.map(order => {
        // escape raw expressions
        if ( order instanceof Raw ) return this.compileRaw(order)
        
        return this.columnize(order.column) + ' ' + order.direction
      }).join(', ')
    }
  }
  
  /**
   * 
   * @param {QueryBuilder} qb
   * @return string
   */
  compileLimit(qb) {
    if ( isNumber(qb.take) ) {
      return 'limit ' + this.parameterize(qb.take)
    }
  }
  
  /**
   * 
   * @param {QueryBuilder} qb
   * @return string
   */
  compileOffset(qb) {
    if ( isNumber(qb.skip) ) {
      return 'offset ' + this.parameterize(qb.skip)
    }
  }
  
  /**
   * 
   * @param {QueryBuilder} qb
   * @return string
   */
  compileUnions(qb) {
    var unions = qb.unions.map(obj => {
      var all = (obj.all ? 'all ' : '')
      var sql = this.compileRaw(obj.query)
      
      return isEmpty(sql) ? '' : `union ${all}${sql}`
    })
    
    return compact(unions).join(' ')
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
      return bool + this.compileRaw(column)
    
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
    var method = criterion.isColumn ? 'escape' : 'parameterize'
    var operator = this.operator(criterion.operator)
    var column = this.escape(criterion.column)
    var value = this[method](criterion.value)
    var not = criterion.negate ? 'not ' : ''
    
    return `${not}${column} ${operator} ${value}`
  }
  
  /**
   * 
   * @param {Raw} value
   * @return string
   */
  compileRaw(value) {
    var bindings = value.bindings
    
    if (! isArray(bindings) ) bindings = [bindings]
    
    bindings.forEach(v => this.addBinding(v))
    
    return this.alias(value.before + value.expression + value.after, value.name)
  }
  
  /**
   * 
   * @param {Aggregate} value
   * @return string
   */
  compileAggregate(value) {
    var column = this.columnize(value.column)
    var distinct = value.isDistinct ? 'distinct ' : ''
    var expression  = `${value.method}(${distinct}${column})`
    
    return this.alias(expression, value.name)
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
      return this.compileRaw(value)
    
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
      return this.compileRaw(value)
    
    // escape aggregate columns
    if ( value instanceof Aggregate )
      return this.compileAggregate(value)
    
    if (! isString(value) ) 
      throw new TypeError("Invalid value to escape")
    
    if ( (asIndex = value.toLowerCase().indexOf(' as ')) > 0 ) {
      let one = value.slice(0, asIndex)
      let two = value.slice(asIndex + 4)
      
      return this.alias(this.escape(one), two)
    }
    
    return value.split('.').map(this.escapeIdentifier).join('.')
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