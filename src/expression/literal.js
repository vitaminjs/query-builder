
import Expression from '../expression'

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

    return new Literal(String(expr), args)
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
   * @override
   */
  clone () {
    return new Literal(this.expr, this.values.slice())
  }
}
