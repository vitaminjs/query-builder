
import Expression from './base'
import Literal from './literal'

/**
 * @class CommonTableExpression
 */
export default class CommonTable extends Expression {
  /**
   * @param {Statement} query
   * @param {String} name
   * @param {Array} columns
   * @constructor
   */
  constructor (query, name, columns = []) {
    super()

    this.name = name
    this.query = query
    this.columns = columns
  }

  /**
   * @param {Expression} query
   * @param {String} name
   * @param {Array} columns
   * @returns {Expression}
   */
  static from (query, name, columns = []) {
    if (query instanceof Literal) return query

    return new CommonTable(query, name, columns)
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   * @override
   */
  compile (compiler) {
    return compiler.compileCommonTable(this)
  }

  /**
   * @returns {CommonTable}
   */
  clone () {
    return new CommonTable(this.query, this.name, this.columns)
  }
}
