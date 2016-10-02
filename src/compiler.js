
import { isEmpty, isArray, isNull, compact, flatten } from 'underscore'
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
  
  compile(query) {
    var sql = '' 
    
    // reset bindings
    this.bindings = []
    
    switch ( query.type ) {
      case 'select': sql = this.compileSelect(query); break
      
      case 'insert': sql = this.compileInsert(query); break
      
      case 'update': sql = this.compileUpdate(query); break
      
      case 'delete': sql = this.compileDelete(query); break
    }
    
    return { sql, bindings: flatten(this.bindings) }
  }
  
  compileRaw(raw) {
    var expr = raw.expression
    
    if ( raw.before && raw.after ) {
      expr = raw.before + expr + raw.after
    }
    
    return (raw.name) ? this.alias(expr, raw.name) : expr
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
        if ( this.isRaw(order) ) return this.escape(order)
        
        return `${this.columnize(order.column)} ${order.direction}`
      }).join(', ')
    }
  }
  
  compileInsert() {
    
  }
  
  compileUpdate() {
    
  }
  
  compileDelete() {
    
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
    
    if ( this.isRaw(value) ) {
      this.addBinding(value.bindings)
      return value.toSQL()
    }
    
    if ( (asIndex = value.toLowerCase().indexOf(' as ')) > 0 ) {
      let one = value.slice(0, asIndex)
      let two = value.slice(asIndex + 4)
      
      return this.alias(this.escape(one), two)
    }
    
    return value.split('.').map(this._escape).join('.')
  }
  
  /**
   * 
   * 
   * @param {Any} value
   * @return string
   */
  parameter(value) {
    if ( this.isRaw(value) ) {
      this.addBinding(value.bindings)
      return value.toSQL()
    }
    
    this.addBinding(value)
    
    return this.param
  }
  
  isRaw(value) {
    return value instanceof Raw
  }
  
  _escape(value) {
    return (value === '*') ? value : `"${value.trim().replace('"', '""')}"`
  }
  
}