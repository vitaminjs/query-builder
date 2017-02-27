
import { isEmpty } from 'lodash'
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
   * Escape function name
   * 
   * @param {String} name
   * @param {Array} args
   * @returns {String}
   */
  compileFunction(name, args = []) {
    switch ( name ) {
      case 'space':
        return super.compileFunction('repeat', [' ', args[0]])
      
      default:
        return super.compileFunction(name, args)
    }
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