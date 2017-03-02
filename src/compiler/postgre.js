
import { isEmpty, first } from 'lodash'
import Compiler from './base'

/**
 * @class PostgreCompiler
 */
export default class extends Compiler {
  
  /**
   * 
   * @param {Object} options
   * @constructor
   */
  constructor(options = {}) {
    super(options)

    this.paramCount = 1
  }
  
  /**
   * Default parameter placeholder
   * 
   * @type {String}
   */
  get placeholder() {
    return '$' + this.paramCount++
  }

  /**
   * 
   * @param {Insert} query
   * @returns {String}
   */
  compileInsertQuery(query) {
    var sql = super.compileInsertQuery(query)

    return this.appendReturningClause(sql, query.getReturning())
  }

  /**
   * 
   * @param {Update} query
   * @returns {String}
   */
  compileUpdateQuery(query) {
    var sql = super.compileUpdateQuery(query)

    return this.appendReturningClause(sql, query.getReturning())
  }

  /**
   * 
   * @param {Delete} query
   * @returns {String}
   */
  compileDeleteQuery(query) {
    var sql = super.compileDeleteQuery(query)

    return this.appendReturningClause(sql, query.getReturning())
  }

  /**
   * 
   * @param {Insert} query
   * @returns {String}
   */
  compileInsertDefaultValues(query) {
    var sql = super.compileInsertDefaultValues(query)

    return this.appendReturningClause(sql, query.getReturning())
  }
  
  /**
   * Compile the function name and its arguments
   * 
   * @param {String} name
   * @param {Array} args
   * @returns {String}
   */
  compileFunction(name, args = []) {
    switch ( name ) {
      case 'now':
        return "localtimestamp(0)"
      
      case 'current_date':
        return "current_date"
      
      case 'current_time':
        return `current_time(0)`
      
      case 'utc':
        return "current_timestamp(0) at time zone 'UTC'"
      
      case 'space':
        return `repeat(' ', ${this.parameter(first(args))})`
      
      case 'date':
        return this.cast(first(args), 'date')
      
      case 'time':
        return this.cast(first(args), 'time(0)')
      
      case 'day':
      case 'year':
      case 'month':
        return this.compileExtractFunction(name, first(args))
      
      default:
        return super.compileFunction(name, args)
    }
  }

  /**
   * 
   * @param {String} part
   * @param {Any} expr
   * @returns {String}
   */
  compileExtractFunction(part, expr) {
    return `extract(${part} from timestamp ${this.parameter(expr)})`
  }

  /**
   * 
   * @param {String} sql
   * @param {Array} columns
   * @returns {String}
   * @private
   */
  appendReturningClause(sql, columns) {
    return isEmpty(columns) ? sql : `${sql} returning ${this.columnize(columns)}`
  }
  
}