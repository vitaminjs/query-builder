
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

    return this.appendReturningClause(sql, query.option('returning'))
  }

  /**
   * 
   * @param {Insert} query
   * @returns {String}
   */
  compileInsertDefaultValues(query) {
    var sql = super.compileInsertDefaultValues(query)

    return this.appendReturningClause(sql, query.option('returning'))
  }

  /**
   * 
   * @param {String} sql
   * @param {Array} columns
   * @returns {String}
   * @private
   */
  appendReturningClause(sql, columns = undefined) {
    return columns ? `${sql} returning ${this.columnize(columns)}` : sql
  }
  
}