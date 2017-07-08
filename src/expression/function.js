
import Alias from './alias'
import Expression from './base'

/**
 * @class FunctionExpression
 */
export default class Function extends Expression {
  constructor (name, args = [], distinct = false) {
    super()

    this.name = name
    this.args = args
    this.isDistinct = distinct
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

  /**
   * @returns {Function}
   */
  clone () {
    return new this.constructor(this.name, this.args.slice(), this.isDistinct)
  }
}
