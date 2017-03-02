
import { compact, each, isObject, isArray, isString, isUndefined } from 'lodash'
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
  get placeholder() {
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
    var select = 'select ' + (query.isDistinct() ? 'distinct ' : '')
    
    return select + this.compileSelectComponents(query)
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileSelectComponents(query) {
    var components = [
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
    
    return compact(components).join(' ')
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
    return this.columnize(query.hasColumns() ? query.getColumns() : ['*'])
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
    
    return 'limit ' + this.parameter(query.getLimit())
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileOffset(query) {
    if (! query.hasOffset() ) return ''
    
    return 'offset ' + this.parameter(query.getOffset())
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
   * 
   * @param {Insert} query
   * @returns {String}
   */
  compileInsertQuery(query) {
    if ( query.option('default values') === true )
      return this.compileInsertDefaultValues(query)

    var values = this.compileInsertValues(query)
    var table = this.compileInsertTable(query)

    return `insert into ${table} ${values}`
  }

  /**
   * 
   * @param {Insert} query
   * @returns {String}
   */
  compileInsertDefaultValues(query) {
    return `insert into ${this.compileInsertTable(query)} default values`
  }

  /**
   * 
   * @param {Insert} query
   * @returns {String}
   */
  compileInsertTable(query) {
    var columns = query.hasColumns() ? ` (${this.columnize(query.getColumns())})` : ''

    return this.escape(query.getTable()) + columns
  }

  /**
   * 
   * @param {Insert} query
   * @returns {String}
   */
  compileInsertValues(query) {
    if ( query.hasSelect() )
      return this.compileSelectQuery(query.getSelect())

    var columns = query.getColumns().map(value => value.toString())

    return 'values ' + query.getValues().map(value => {

      return `(${columns.map(key => this.parameter(value[key], true)).join(', ')})`

    }).join(', ')
  }

  /**
   * 
   * @param {Update} query
   * @returns {String}
   */
  compileUpdateQuery(query) {
    var table = this.escape(query.getTable())
    var sql = `update ${table} ${this.compileUpdateValues(query)}`

    if ( query.hasConditions() )
      sql += ` ${this.compileConditions(query)}`
    
    return sql
  }

  /**
   * 
   * @param {Update} query
   * @returns {String}
   */
  compileUpdateValues(query) {
    var expr = 'set'
    
    each(query.getValues(), (value, key) => {
      expr += ` ${key} = ${this.parameter(value, true)},`
    })
    
    // we omit the last comma
    return expr.substr(0, expr.length - 1)
  }

  /**
   * 
   * @param {Delete} query
   * @returns {String}
   */
  compileDeleteQuery(query) {
    var sql = `delete from ${this.escape(query.getTable())}`

    if ( query.hasConditions() )
      sql += ` ${this.compileConditions(query)}`
    
    return sql
  }
  
  /**
   * Compile the function name and its arguments
   * 
   * @param {String} name
   * @param {Array} args
   * @returns {String}
   */
  compileFunction(name, args = []) {
    if ( name === 'concat' )
      return `concat(${args.map(value => this.escape(value)).join(', ')})`

    return name + this.parameterize(args)
  }

  /**
   * 
   * @param {Any} value
   * @param {String} type
   * @param {Boolean} isLiteral
   * @returns {String}
   */
  cast(value, type, isLiteral = false) {
    return `cast(${isLiteral ? value : this.parameter(value)} as ${type})`
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
   * @param {Array} value
   * @returns {String}
   */
  parameterize(value) {
    if (! isArray(value) ) return this.parameter(value)

    return `(${value.map(item => this.parameter(item)).join(', ')})`
  }

  /**
   * 
   * @param {Any} value
   * @param {Boolean} replaceUndefined
   * @returns {String}
   */
  parameter(value, replaceUndefined = false) {
    // compile expressions
    if ( value instanceof Expression )
      return value.compile(this)

    // replace undefined values with `default` placeholder
    if ( replaceUndefined && isUndefined(value) )
      return 'default'

    return this.addBinding(value).placeholder
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

    if ( isString(value) )
      value = `'${value.replace(/'/g, "''")}'`
    
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
