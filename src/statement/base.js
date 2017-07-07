
import { isString } from 'lodash'
import Expression, { Alias } from '../expression'
import Compiler, { createCompiler } from '../compiler'

export default class Statement extends Expression {
  constructor () {
    super()

    this.isChild = false  // true for sub queries
  }

  /**
   * @param {String|Compiler} dialect
   * @param {Object} options
   * @returns {Object}
   * @throws {TypeError}
   */
  build (dialect, options = {}) {
    if (isString(dialect)) dialect = createCompiler(dialect, options)

    if (dialect instanceof Compiler) {
      let sql = this.compile(dialect)
      let params = dialect.getBindings()

      return { sql, params }
    }

    throw new TypeError('Invalid query compiler')
  }

  /**
   *
   * @param {String} name
   * @param {Array} columns
   * @returns {Alias}
   */
  as (name, ...columns) {
    this.isChild = true

    return new Alias(this, name, ...columns)
  }
}
