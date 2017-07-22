
import Compiler from '../compiler'
import { isEmpty, first } from 'lodash'

/**
 * @class PostgreCompiler
 */
export default class extends Compiler {
  /**
   * @param {Object} options
   * @constructor
   */
  constructor (options) {
    super(options)

    this.paramCount = 1
  }

  /**
   * @returns {String}
   */
  placeholder () {
    return '$' + this.paramCount++
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileInsertQuery ({ output }) {
    return this.appendReturningClause(super.compileInsertQuery(arguments[0]), output)
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileUpdateQuery ({ output }) {
    return this.appendReturningClause(super.compileUpdateQuery(arguments[0]), output)
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileDeleteQuery ({ output }) {
    return this.appendReturningClause(super.compileDeleteQuery(arguments[0]), output)
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileFunction ({ name, args = [] }) {
    switch (name) {
      case 'now':
        return 'localtimestamp(0)'

      case 'current_date':
        return 'current_date'

      case 'current_time':
        return `current_time(0)`

      case 'utc':
        return "current_timestamp(0) at time zone 'UTC'"

      case 'space':
        return `repeat(' ', ${this.parameter(first(args))})`

      case 'date':
        return this.cast(first(args), 'date')

      case 'time':
        return this.cast(first(args), 'time(0)')

      case 'day':
      case 'hour':
      case 'year':
      case 'month':
      case 'minute':
      case 'second':
        return this.compileExtractFunction(name, first(args))

      default:
        return super.compileFunction(arguments[0])
    }
  }

  /**
   * @param {String} part
   * @param {Any} expr
   * @returns {String}
   * @private
   */
  compileExtractFunction (part, expr) {
    return `extract(${part} from ${this.parameter(expr)})`
  }

  /**
   * @param {String} sql
   * @param {Array} columns
   * @returns {String}
   * @private
   */
  appendReturningClause (sql, columns) {
    return isEmpty(columns) ? sql : `${sql} returning ${this.columnize(columns)}`
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileOrder ({ expr, direction, nulls }) {
    let out = `${this.escape(expr)} ${direction === 'desc' ? 'desc' : 'asc'}`

    if (nulls !== false) {
      out += ` nulls ${nulls === 'last' ? 'last' : 'first'}`
    }

    return out
  }
}
