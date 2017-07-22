
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
    throw new Error('Expression.clone() not yet overridden')
  }

  /**
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual (expr) {
    return this === expr
  }
}
