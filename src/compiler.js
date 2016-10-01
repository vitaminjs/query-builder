
import { isEmpty, isNull, compact } from 'underscore'
import Raw from './raw'

export default class {
  
  constructor() {
    
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
    switch ( query.type ) {
      case 'select': return this.compileSelect(query)
      
      case 'insert': return this.compileInsert(query)
      
      case 'update': return this.compileUpdate(query)
      
      case 'delete': return this.compileDelete(query)
      
      default: return ''
    }
  }
  
  compileRaw(raw) {
    var expr = raw.expression
    
    if ( raw.before && raw.after ) {
      expr = raw.before + expr + raw.after
    }
    
    return (raw.name) ? this.alias(expr, raw.name) : expr
  }
  
  compileSelect(query) {
    var distinct = query.isDistinct ? 'distinct ' : ''
    var sql = this.selectComponents.map(c => this['compile' + c](query))
    
    if ( isEmpty(query.columns) && isEmpty(query.table) ) return ''
    
    return 'select ' + distinct + compact(sql).join(' ')
  }
  
  compileColumns(query) {
    var columns = ( isEmpty(query.columns) ) ? ['*'] : query.columns
    
    return columns.map(col => {
      if ( col instanceof Raw )
        query.addBinding(col.getBindings())
      
      return this.escape(col)
    }).join(', ')
  }
  
  compileFrom(query) {
    if (! isEmpty(query.table) ) {
      let table = query.table
      
      if ( table instanceof Raw )
        query.addBinding(table.getBindings())
      
      return 'from ' + this.alias(this.escape(table), query.alias)
    }
  }
  
  compileLimit(query) {
    if (! isNull(query.take) ) {
      query.addBinding(query.take)
      return 'limit ' + this.param
    }
  }
  
  compileOffset(query) {
    if (! isNull(query.skip) ) {
      query.addBinding(query.skip)
      return 'offset ' + this.param
    }
  }
  
  compileGroups(query) {
    if (! isEmpty(query.groups) ) 
      return 'group by ' + this.columnize(query.groups)
  }
  
  compileOrders(query) {
    if (! isEmpty(query.orders) ) {
      return 'order by ' + query.orders.map(order => {
        if ( order instanceof Raw ) {
          query.addBinding(order.getBindings())
          return order.toSQL()
        }
        
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
  
  columnize(columns = []) {
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
    
    if ( value instanceof Raw ) return value.toSQL()
    
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
    return ( value instanceof Raw ) ? value.toSQL() : this.param
  }
  
  _escape(value) {
    return (value === '*') ? value : `"${value.trim().replace('"', '""')}"`
  }
  
}