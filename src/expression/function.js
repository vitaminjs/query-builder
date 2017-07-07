
import Alias from './alias'
import Expression from './base'

/**
 * @class FunctionExpression
 */
export default class Function extends Expression {
  constructor (name, args = []) {
    super()

    this.name = name
    this.args = args
    this.isDistinct = false
  }

  /**
   * @param {Boolean} flag
   * @returns {Aggregate}
   */
  distinct (flag = true) {
    this.isDistinct = flag
    return this
  }

  /**
   * @param {String} name
   * @returns {Alias}
   */
  as (name) {
    return new Alias(this, name)
  }

  /**
   *
   * @param {Compiler}
   * @returns {String}
   * @override
   */
  compile (compiler) {
    return compiler.compileFunction(this)
  }
}
