
import Expression from '../expression'

/**
 * @class OrderExpression
 */
export default class Order extends Expression {
  /**
   * @param {Expression} expr
   * @param {String} direction
   * @param {Boolean|String} nulls
   * @constructor
   */
  constructor (expr, direction = 'asc', nulls = false) {
    super()

    this.expr = expr
    this.nulls = nulls
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

  /**
   * @returns {Order}
   * @override
   */
  clone () {
    return new Order(this.expr, this.direction, this.nulls)
  }
}
