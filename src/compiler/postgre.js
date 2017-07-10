
import Compiler from './base'
import { isEmpty, first } from 'lodash'

/**
 * @class PostgreCompiler
 */
export default class extends Compiler {
  /**
   * @constructor
   */
  constructor () {
    super()

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
  compileInsertQuery (query) {
    var sql = super.compileInsertQuery(query)

    return this.appendReturningClause(sql, query.getReturning())
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileUpdateQuery (query) {
    var sql = super.compileUpdateQuery(query)

    return this.appendReturningClause(sql, query.getReturning())
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileDeleteQuery (query) {
    var sql = super.compileDeleteQuery(query)

    return this.appendReturningClause(sql, query.getReturning())
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileFunction ({ name, args = [], isDistinct = false }) {
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
        return super.compileFunction({ name, args, isDistinct })
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
}
