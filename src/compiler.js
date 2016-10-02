
import { isEmpty, isArray, isNull, compact, flatten } from 'underscore'
import Aggregate from './aggregate'
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
      // 'Wheres',
      // 'Unions',
      'Groups',
      // 'Havings',
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
    
    return { sql: expr, bindings: raw.bindings }
  }
  
  compileAggregate(raw) {
    var distinct = raw.isDistinct ? 'distinct ' : ''
    
    raw.expression += `(${distinct}${this.columnize(raw.column)})`
    
    return this.compileRaw(raw)
  }
  
  compileSelect(query) {
    var distinct = query.isDistinct ? 'distinct ' : ''
    var sql = this.selectComponents.map(c => this['compile' + c](query))
    
    if ( isEmpty(query.columns) && isEmpty(query.table) ) return ''
    
    return 'select ' + distinct + compact(sql).join(' ')
  }
  
  compileColumns(query) {
    return this.columnize(isEmpty(query.columns) ? '*' : query.columns)
  }
  
  compileFrom(query) {
    if (! isEmpty(query.table) ) {
      return 'from ' + this.alias(this.escape(query.table), query.alias)
    }
  }
  
  compileLimit(query) {
    if (! isNull(query.take) ) {
      return 'limit ' + this.parameter(query.take)
    }
  }
  
  compileOffset(query) {
    if (! isNull(query.skip) ) {
      return 'offset ' + this.parameter(query.skip)
    }
  }
  
  compileGroups(query) {
    if (! isEmpty(query.groups) ) 
      return 'group by ' + this.columnize(query.groups)
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
    
    if ( this.isAggregate(value) ) return this.escapeAggregate(value)
    
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
   * @param {Aggregate} value
   * @return string
   */
  escapeAggregate(value) {
    var obj = this.compileAggregate(value)
    
    this.addBinding(obj.bindings)
    
    return obj.sql
  }
  
  /**
   * 
   * @param {Raw} value
   * @return string
   */
  escapeRaw(value) {
    var obj = this.compileRaw(value)
    
    this.addBinding(obj.bindings)
    
    return obj.sql
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
    
    return this.param
  }
  
  /**
   * 
   * @param {String} method
   * @param {String} column
   * @param {Boolean} isDistinct
   * @return Aggregate instance
   */
  isAggregate(value) {
    return value instanceof Aggregate
  }
  
  isRaw(value) {
    return value instanceof Raw
  }
  
  _escape(value) {
    return (value === '*') ? value : `"${value.trim().replace('"', '""')}"`
  }
  
}