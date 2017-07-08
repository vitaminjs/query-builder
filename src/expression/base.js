
/**
 * @class BaseExpression
 */
export default class Expression {
  /**
   * @param {Compiler}
   * @returns {String}
   */
  compile (compiler) {
    throw new Error('Expression.compile() not yet overridden')
  }

  /**
   * @returns {Expression}
   */
  clone () {
    return new this.constructor(...arguments)
  }

  /**
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual (expr) {
    return this === expr
  }
}
