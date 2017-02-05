
import { compact, isObject, isArray, isBoolean, isString, isUndefined } from 'lodash'
import Expression from '../expression'

/**
 * @class BaseCompiler
 */
export default class Compiler {
  
  /**
   * BaseCompiler constructor
   * 
   * @param {Object} options
   * @constructor
   */
  constructor(options = {}) {
    this.bindings = []
    this.options = options
  }
  
  /**
   * Default parameter placeholder
   * 
   * @type {String}
   */
  get parameter() {
    return '?'
  }

  /**
   * 
   * @returns {Array}
   */
  getBindings() {
    return this.bindings
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileSelectQuery(query) {
    var sql = this.compileSelectComponents(query)
    
    return sql
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileSelectComponents(query) {
    var sql = [
      this.compileSelectColumns(query),
      this.compileTables(query),
      this.compileJoins(query),
      this.compileConditions(query),
      this.compileGroups(query),
      this.compileHavingConditions(query),
      this.compileOrders(query),
      this.compileLimit(query),
      this.compileOffset(query),
    ]
    
    return compact(sql).join(' ')
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileUnionComponents(query) {
    var sql = [
      this.compileUnions(query),
      this.compileOrders(query),
      this.compileLimit(query),
      this.compileOffset(query),
    ]
    
    return compact(sql).join(' ')
  }
  
  /**
   * Compile the query columns part
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileSelectColumns(query) {
    var columns = query.hasColumns() ? query.getColumns() : ['*']
    var select = 'select ' + (query.isDistinct() ? 'distinct ' : '')

    return select + this.columnize(columns)
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileTables(query) {
    if (! query.hasTables() ) return ''
    
    return 'from ' + query.getTables().map(expr => this.escape(expr)).join(', ')
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileJoins(query) {
    if (! query.hasJoins() ) return ''

    return query.getJoins().map(expr => this.escape(expr)).join(' ')
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileConditions(query) {
    if (! query.hasConditions() ) return ''
    
    return 'where ' + query.getConditions().compile(this)
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileGroups(query) {
    if (! query.hasGroups() ) return ''
    
    return 'group by ' + this.columnize(query.getGroups())
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileHavingConditions(query) {
    if (! query.hasHavingConditions() ) return ''
    
    return 'having ' + query.getHavingConditions().compile(this)
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileOrders(query) {
    if (! query.hasOrders() ) return ''
    
    return 'order by ' + this.columnize(query.getOrders())
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileLimit(query) {
    if (! query.hasLimit() ) return ''
    
    return 'limit ' + this.parameterize(query.getLimit())
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileOffset(query) {
    if (! query.hasOffset() ) return ''
    
    return 'offset ' + this.parameterize(query.getOffset())
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileUnions(query) {
    if (! query.hasUnions() ) return ''

    return query.getUnions().map(expr => this.escape(expr)).join(' ')
  }
  
  /**
   * Escape function name
   * 
   * @param {String} name
   * @param {Array} args
   * @returns {String}
   */
  compileFunction(name, args = []) {
    return `${name}(${this.parameterize(args)})`
  }
  
  /**
   * Validate the query operator
   * 
   * @param {String} value
   * @returns {String}
   */
  operator(value) {
    // TODO
    return value || '='
  }
  
  /**
   * 
   * @param {Any} value
   * @returns {String}
   */
  parameterize(value) {
    if (! isArray(value) ) value = [value]
    
    return value.map(val => {
      // escape expressions
      if ( val instanceof Expression )
        return val.compile(this)

      return this.addBinding(val).parameter
    }).join(', ')
  }
  
  /**
   * Add query binding value
   * 
   * @param {Any} value
   * @returns {Compiler}
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
   * @returns {String}
   */
  columnize(columns) {
    if (! isArray(columns) ) columns = [columns]
    
    return columns.map(expr => this.escape(expr)).join(', ')
  }
  
  /**
   * Escape the given value
   * 
   * @param {Any} value
   * @returns {String}
   */
  escape(value) {
    if ( value === '*' )
      return value
    
    // escape expressions
    if ( value instanceof Expression )
      return value.compile(this)

    if ( isString(value) ) value = `'${value}'`
    
    return value
  }
  
  /**
   * Quotes a string so it can be safely used as a table or column name
   * 
   * @param {String} value
   * @returns {String}
   */
  quote(value) {
    return (value === '*') ? value : `"${value.trim().replace(/"/g, '""')}"`
  }
  
  /**
   * Join two identifiers by `AS` clause
   * 
   * @param {String} first
   * @param {String} second
   * @returns {String}
   */
  alias(first, second = null) {
    return first + (second ? ' as ' + this.quote(second) : '')
  }
  
}
