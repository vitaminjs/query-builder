
import Alias from '../alias'
import Expression from '../base'
import Literal from '../literal'
import CommonTable from '../cte'
import { isString } from 'lodash'
import Compiler, { createCompiler } from '../../compiler'

/**
 * @class StatementExpression
 */
export default class Statement extends Expression {
  /**
   * @param {String|Expression} table
   * @constructor
   */
  constructor (table) {
    this.cte = []
    this.table = Literal.from(table)
  }

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
   * @returns {Expression}
   */
  getTable () {
    return this.table
  }

  /**
   * @param {Any} value
   * @returns {Select}
   */
  setTable (value) {
    if (value instanceof Statement) {
      value = value.toSubQuery()
    }

    this.table = Literal.from(value)
    
    return this
  }

  /**
   * @returns {Literal}
   */
  toSubQuery () {
    return new Literal('(?)', [this])
  }

  /**
   * @param {String} name
   * @param {Array} columns
   * @returns {Alias}
   */
  as (name, ...columns) {
    return new Alias(this.toSubQuery(), name, columns)
  }

  /**
   * @param {Any} expr
   * @param {String} name
   * @param {Array} columns
   * @returns {Select}
   */
  with (expr, name, ...columns) {
    this.getCTE().push(CommonTable.from(expr, name, columns))
    return this
  }

  /**
   * @returns {Array}
   */
  getCTE () {
    return this.cte
  }

  /**
   * @returns {Boolean}
   */
  hasCTE () {
    return this.cte.length > 0
  }

  /**
   * @returns {Select}
   */
  resetCTE () {
    return this.setCTE([])
  }

  /**
   * @param {Array} value
   * @returns {Select}
   */
  setCTE (value) {
    this.cte = value
    return this
  }
}
