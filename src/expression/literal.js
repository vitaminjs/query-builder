
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
   * @param {Any} expr
   * @param {Array} args
   * @returns {Expression}
   */
  static from (expr, ...args) {
    if (expr instanceof Expression) return expr

    return new Literal(expr.toString(), args)
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   * @override
   */
  compile (compiler) {
    return compiler.compileLiteral(this)
  }

  /**
   * @returns {Literal}
   */
  clone () {
    return new Literal(this.expr, this.values.slice())
  }
}
