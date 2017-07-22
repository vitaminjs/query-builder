
import Literal from './literal'
import Expression from '../expression'

/**
 * @class CommonTableExpression
 */
export default class CommonTable extends Expression {
  /**
   * @param {Any} expr
   * @param {String} name
   * @param {Array} columns
   * @constructor
   */
  constructor (expr, name, columns = []) {
    super()

    this.name = name
    this.expr = expr
    this.columns = columns
  }

  /**
   * @param {Any} expr
   * @param {String} name
   * @param {Array} columns
   * @returns {Expression}
   */
  static from (expr, name, columns = []) {
    if (expr instanceof Literal && !name) return expr

    if (expr instanceof CommonTable) return expr

    return new CommonTable(expr, name, columns)
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
   * @override
   */
  clone () {
    return new CommonTable(this.expr, this.name, this.columns)
  }
}
