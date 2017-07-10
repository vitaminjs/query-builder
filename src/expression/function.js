
import Alias from './alias'
import Expression from './base'

/**
 * @class FunctionExpression
 */
export default class Function extends Expression {
  /**
   * @param {String} name
   * @param {Array} args
   * @constructor
   */
  constructor (name, args = []) {
    super()

    this.name = name
    this.args = args
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
    return new this.constructor(this.name, this.args.slice())
  }
}
