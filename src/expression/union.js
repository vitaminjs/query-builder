
import Expression from './base'

/**
 * @class UnionExpression
 */
export default class Union extends Expression {
  /**
   * @param {Expression} query
   * @param {String} all
   * @constructor
   */
  constructor(query, filter = 'distinct') {
    super()

    this.query = query
    this.filter = filter
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile (compiler) {
    return compiler.compileUnion(this)
  }

  /**
   * @returns {Union}
   * @override
   */
  clone () {
    return new Union(this.query, this.filter)
  }
}
