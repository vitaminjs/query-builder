
import CTE from './cte'
import Alias from './alias'
import Literal from './literal'
// import { isString } from 'lodash'
import Expression from '../expression'
// import Compiler, { createCompiler } from '../compiler'

/**
 * @class StatementExpression
 */
export default class Statement extends Expression {
  /**
   * @constructor
   */
  constructor () {
    super()

    this.cte = []
    this.table = null
  }

  /**
   * @param {String|Compiler} dialect
   * @param {Object} options
   * @returns {Object}
   * @throws {TypeError}
   */
  // build (dialect, options = {}) {
  //   if (isString(dialect)) dialect = createCompiler(dialect, options)

  //   if (dialect instanceof Compiler) return dialect.build(this)

  //   throw new TypeError('Invalid query compiler')
  // }

  /**
   * @param {String} name
   * @param {Array} columns
   * @returns {Alias}
   */
  as (name, ...columns) {
    return new Alias(this, name, columns)
  }

  /**
   * @returns {Boolean}
   */
  hasTable () {
    return this.table != null
  }

  /**
   * @returns {Expression}
   */
  getTable () {
    return this.table
  }

  /**
   * @param {String|Expression} value
   * @returns {Statement}
   */
  setTable (value) {
    this.table = Literal.from(value)
    return this
  }

  /**
   * @returns {Statement}
   */
  resetTable () {
    return this.setTable(null)
  }

  /**
   * @param {Any} expr
   * @param {String} name
   * @param {Array} columns
   * @returns {Statement}
   */
  addCTE (expr, name, ...columns) {
    this.getCTE().push(CTE.from(expr, name, columns))
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
   * @returns {Statement}
   */
  resetCTE () {
    return this.setCTE([])
  }

  /**
   * @param {Array} value
   * @returns {Statement}
   */
  setCTE (value) {
    this.cte = value
    return this
  }
}
