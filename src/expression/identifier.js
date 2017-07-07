
import Alias from './alias'
import Expression from './base'

/**
 * @class IdentifierExpression
 */
export default class Identifier extends Expression {
  /**
   * @param {String} value
   * @constructor
   */
  constructor (value) {
    super()

    this.name = value
  }

  /**
   * @param {String} name
   * @returns {Alias}
   */
  as (name) {
    return new Alias(this, name)
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   * @override
   */
  compile (compiler) {
    return compiler.compileIdentifier(this)
  }
}
