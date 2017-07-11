
import Expression from './base'

/**
 * @class AliasExpression
 */
export default class Alias extends Expression {
  /**
   * @param {Any} value
   * @param {String} name
   * @param {Array} columns
   * @constructor
   */
  constructor (value, name, columns = []) {
    super()

    this.name = name
    this.value = value
    this.isCTE = false
    this.columns = columns
  }

  /**
   * @returns {Alias}
   */
  forCTE () {
    this.isCTE = true
    return this
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   * @override
   */
  compile (compiler) {
    return compiler.compileAlias(this)
  }
}
