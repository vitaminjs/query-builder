
import { isEmpty, isArray, isNumber, compact, flatten } from 'lodash'
import Aggregate from './aggregate'
import Criteria from './criteria'
import Raw from './raw'

/**
 * @class Compiler
 */
export default class {
  
  constructor() {
    this.bindings = []
  }
  
  get param() {
    return '?'
  }
  
  get selectComponents() {
    return [
      'Columns',
      'From',
      // 'Joins',
      'Wheres',
      'Groups',
      'Havings',
      // 'Unions',
      'Orders',
      'Limit',
      'Offset',
    ]
  }
  
  /**
   * 
   * @param {Query} query
   * @param {String} type
   * @return plain object
   */
  compile(query, type = 'select') {
    // camelize the compilation type
    // TODO use _.camelize instead
    var method = 'compile' + type.slice(0, 1).toUpperCase() + type.slice(1)
    
    if (! this[method] )
      throw new TypeError("Unknown compilation method")
    
    // reset bindings
    this.bindings = []
    
    var sql = this[method](query)
    
    return { sql, bindings: flatten(this.bindings) }
  }
  
  compileRaw(raw) {
    var expr = raw.before + raw.expression + raw.after
    
    if ( raw.name ) expr = this.alias(expr, raw.name)
    
    return expr
  }
  
  compileAggregate(obj) {
    var column = this.columnize(obj.column)
    var distinct = obj.isDistinct ? 'distinct ' : ''
    var expr = `${obj.method}(${distinct}${column})`
    
    if ( obj.name ) expr = this.alias(expr, obj.name)
    
    return expr
  }
  
  compileSelect(query) {
    var distinct = query.isDistinct ? 'distinct ' : ''
    var sql = this.selectComponents.map(c => this['compile' + c](query))
    
    if ( isEmpty(query.columns) && isEmpty(query.tables) ) return ''
    
    return 'select ' + distinct + compact(sql).join(' ')
  }
  
  compileColumns(query) {
    return this.columnize(isEmpty(query.columns) ? '*' : query.columns)
  }
  
  compileFrom(query) {
    if (! isEmpty(query.tables) ) {
      return 'from ' + query.tables.map(table => {
        if ( this.isRaw(table) ) return this.escapeRaw(table)
        
        return this.alias(this.escape(table.name), table.alias)
      }).join(', ')
    }
  }
  
  compileLimit(query) {
    if ( isNumber(query.take) ) {
      return 'limit ' + this.parameter(query.take)
    }
  }
  
  compileOffset(query) {
    if ( isNumber(query.skip) ) {
      return 'offset ' + this.parameter(query.skip)
    }
  }
  
  compileGroups(query) {
    if (! isEmpty(query.groups) ) 
      return 'group by ' + this.columnize(query.groups)
  }
  
  compileHavings(query) {
    if (! isEmpty(query.havings) ) {
      return 'having ' + this.compileConditions(query.havings)
    }
  }
  
  compileWheres(query) {
    if (! isEmpty(query.wheres) ) {
      return 'where ' + this.compileConditions(query.wheres)
    }
  }
  
  compileConditions(conditions = []) {
    return conditions.map(cr => this.compileCriteria(cr)).join(' ').substr(3).trim()
  }
  
  compileCriteria(criteria) {
    return criteria.conditions.map(c => this.compileCriterion(c)).join(' ')
  }
  
  /**
   * 
   * @param {Criteria} criteria
   * @return string
   */
  compileCriterion(criterion) {
    var column = criterion.column
    var bool = `${criterion.prefix} `
    var not = criterion.negate ? 'not ' : ''
    
    if ( this.isRaw(column) )
      return bool + this.escapeRaw(column)
    
    if ( column instanceof Criteria ) {
      let criteria = this.compileCriteria(column)
      
      return bool + not + `(${criteria.substring(3).trim()})`
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
  
  compileWhereBetween(criterion) {
    var not = criterion.negate ? 'not ' : ''
    var column = this.escape(criterion.column)
    var value1 = this.parameter(criterion.value[0])
    var value2 = this.parameter(criterion.value[1])
    var operator = this.operator(criterion.operator)
    
    return `${not}${column} ${operator} ${value1} and ${value2}`
  }
  
  compileWhereNull(criterion) {
    var column = this.escape(criterion.column)
    var operator = this.operator(criterion.operator)
    
    return `${column} ${operator} null`
  }
  
  compileWhereIn(criterion) {
    if ( isEmpty(criterion.value) ) {
      return '1 = ' + (criterion.operator === 'in' ? '0' : '1')
    }
    
    var column = this.escape(criterion.column)
    var value = this.parameter(criterion.value)
    var operator = this.operator(criterion.operator)
    
    return `${column} ${operator} (${value})`
  }
  
  compileWhereExists(criterion) {
    var value = this.parameter(criterion.value)
    var operator = this.operator(criterion.operator)
    
    return `${operator} (${value})`
  }
  
  compileBasicCriterion(criterion) {
    var method = criterion.isColumn ? 'escape' : 'parameter'
    var operator = this.operator(criterion.operator)
    var column = this.escape(criterion.column)
    var value = this[method](criterion.value)
    var not = criterion.negate ? 'not ' : ''
    
    return `${not}${column} ${operator} ${value}`
  }
  
  compileOrders(query) {
    if (! isEmpty(query.orders) ) {
      return 'order by ' + query.orders.map(order => {
        if ( this.isRaw(order) ) return this.escapeRaw(order)
        
        return `${this.columnize(order.column)} ${order.direction}`
      }).join(', ')
    }
  }
  
  compileInsert(query) {
    
  }
  
  compileUpdate(query) {
    
  }
  
  compileDelete(query) {
    
  }
  
  /**
   * 
   * 
   * @param {Any} value
   * @return this compiler
   */
  addBinding(value) {
    if ( true )
    
    this.bindings.push(value)
    return this
  }
  
  columnize(columns) {
    if (! isArray(columns) ) columns = [columns]
    
    return columns.map(col => this.escape(col)).join(', ')
  }
  
  /**
   * Join two identifiers by `AS` clause
   * 
   * @param {String} first
   * @param {String} second
   * @return string
   */
  alias(first, second = null) {
    return first + (second ? ' as ' + this._escape(second) : '')
  }
  
  escape(value) {
    var asIndex
    
    if ( value instanceof Aggregate ) 
      return this.compileAggregate(value)
    
    if ( this.isRaw(value) ) return this.escapeRaw(value)
    
    if ( (asIndex = value.toLowerCase().indexOf(' as ')) > 0 ) {
      let one = value.slice(0, asIndex)
      let two = value.slice(asIndex + 4)
      
      return this.alias(this.escape(one), two)
    }
    
    return value.split('.').map(this._escape).join('.')
  }
  
  /**
   * 
   * @param {Raw} value
   * @return string
   */
  escapeRaw(value) {
    var sql = this.compileRaw(value)
    
    this.addBinding(value.bindings)
    
    return sql
  }
  
  /**
   * 
   * 
   * @param {Any} value
   * @return string
   */
  parameter(value) {
    if ( this.isRaw(value) ) return this.escapeRaw(value)
    
    this.addBinding(value)
    
    if ( isArray(value) ) {
      return value.map(() => this.param).join(', ')
    }
    
    return this.param
  }
  
  /**
   * 
   * @param {String} value
   * @return string
   */
  operator(value) {
    return value || '='
  }
  
  isRaw(value) {
    return value instanceof Raw
  }
  
  _escape(value) {
    return (value === '*') ? value : `"${value.trim().replace('"', '""')}"`
  }
  
}