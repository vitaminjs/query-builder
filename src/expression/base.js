
export default class Expression {
  /**
   *
   * @param {Compiler}
   * @returns {String}
   */
  compile (compiler) {
    throw new Error('Expression.compile() not yet overridden')
  }

  isEqual (expr) {
    return this === expr
  }
}
