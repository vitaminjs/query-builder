
import Expression from './base'

/**
 * @class OrderExpression
 */
export default class Order extends Expression {
  /**
   * @param {Expression} expr
   * @param {String} direction
   * @constructor
   */
  constructor (expr, direction = 'asc') {
    super()

    this.expr = expr
    this.nulls = false
    this.direction = direction
  }

  /**
   * @returns {Order}
   */
  asc () {
    this.direction = 'asc'
    return this
  }

  /**
   * @returns {Order}
   */
  desc () {
    this.direction = 'desc'
    return this
  }

  /**
   * @returns {Order}
   */
  nullsFirst () {
    this.nulls = 'first'
    return this
  }

  /**
   * @returns {Order}
   */
  nullsLast () {
    this.nulls = 'last'
    return this
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   * @override
   */
  compile (compiler) {
    return compiler.compileOrder(this)
  }
}
