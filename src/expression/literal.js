
import Expression from './base'

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

  static from (expr, values = []) {
    // TODO
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
