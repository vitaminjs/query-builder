
import Expression from './base'

/**
 * @class LiteralExpression
 */
export default class Literal extends Expression {
  /**
   * @param {String} expr
   * @param {Array} values
   * @constructor
   */
  constructor (expr, values = []) {
    super()

    this.expr = expr
    this.values = values
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   * @override
   */
  compile (compiler) {
    return compiler.compileLiteral(this)
  }
}
