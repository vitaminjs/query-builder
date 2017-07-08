
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
   * @param {Any} value
   * @returns {Expression}
   */
  static from (value) {
    if (value instanceof Expression) return value

    let [expr, alias] = value.toString().split(' as ')

    return alias ? new Identifier(expr).as(alias) : new Identifier(expr)
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

  /**
   * @returns {Identifier}
   */
  clone () {
    return new Identifier(this.name)
  }
}
