
import { isString } from 'lodash'
import Compiler, { createCompiler } from '../compiler'
import Expression, { Alias, Literal } from '../expression'

/**
 * @class StatementExpression
 */
export default class Statement extends Expression {
  /**
   * @param {String|Compiler} dialect
   * @param {Object} options
   * @returns {Object}
   * @throws {TypeError}
   */
  build (dialect, options = {}) {
    if (isString(dialect)) dialect = createCompiler(dialect, options)

    if (dialect instanceof Compiler) return dialect.build(this)

    throw new TypeError('Invalid query compiler')
  }

  /**
   *
   * @param {String} name
   * @param {Array} columns
   * @returns {Alias}
   */
  as (name, ...columns) {
    return new Alias(new Literal('(?)', this), name, ...columns)
  }
}
