
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
   * @param {Insert} query
   * @returns {String}
   */
  compileInsertDefaultValues(query) {
    var sql = super.compileInsertDefaultValues(query)

    return this.appendReturningClause(sql, query.getReturning())
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