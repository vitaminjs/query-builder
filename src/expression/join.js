
import Expression from './base'
import Literal from './literal'
import { compose, useMany, useConditions } from './mixin'

const mixin = compose(
  useConditions(),
  useMany('columns')
)

/**
 * @class JoinExpression
 */
export default class Join extends mixin(Expression) {
  /**
   * @param {Any} table
   * @param {String} type
   * @constructor
   */
  constructor (table, type = 'inner') {
    super()

    this.type = type
    this.table = table
  }

  /**
   * @param {Any} table
   * @param {String} type
   * @returns {Expression}
   */
  static from (table, type = 'inner') {
    if (table instanceof Literal) return table

    return new Join(Literal.from(table), type)
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile (compiler) {
    return compiler.compileJoin(this)
  }
}
