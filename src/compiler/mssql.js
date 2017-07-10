
import Compiler from './base'
import { isEmpty, reverse, first } from 'lodash'

/**
 * @class MssqlCompiler
 */
export default class extends Compiler {
  /**
   * @param {String} value
   * @returns {String}
   * @override
   */
  quote (value) {
    if (/\*|inserted|deleted/.test(value)) return value

    return `[${value.trim().replace(/\]/g, ']]')}]`
  }

  /**
   * @param {Object} query
   * @returns {String}
   * @override
   * @private
   */
  compileSelectColumns (query) {
    return this.compileTopClause(query) + super.compileSelectColumns(query)
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileTopClause ({ limit, offset }) {
    return (!limit || offset) ? '' : `top(${this.parameter(limit)}) `
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   * @private
   */
  compileOrderByClause ({ offset, limit }) {
    let out = super.compileOrderByClause(arguments[0])

    if (!out && offset) {
      // a dummy order to use with offset
      out = 'order by (select 0)'
    }

    if (offset) {
      out += ` offset ${this.parameter(offset)} rows`
    }

    if (limit) {
      out += ` fetch next ${this.parameter(limit)} rows only`
    }

    return out
  }

  /**
   * @param {Object} query
   * @returns {String}
   * @private
   */
  compileLimitClause (query) {
    return ''
  }

  /**
   * @param {Object} query
   * @returns {String}
   * @override
   * @private
   */
  compileInsertClause ({ output }) {
    return this.appendOutputClause(super.compileInsertClause(arguments[0]), output)
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   * @private
   */
  compileSetClause ({ output }) {
    return this.appendOutputClause(super.compileSetClause(arguments[0]), output)
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileDeleteClause ({ output }) {
    return this.appendOutputClause(super.compileDeleteClause(arguments[0]), output, 'deleted')
  }

  /**
   * @param {String} sql
   * @param {Array} columns
   * @param {String} prefix
   * @returns {String}
   * @private
   */
  appendOutputClause (sql, columns = [], prefix = 'inserted') {
    if (isEmpty(columns)) return sql

    // add the inserted or deleted prefix for each column
    columns = columns.map((name) => {
      return /^inserted|deleted/.test(name) ? name : `${prefix}.${name}`
    })

    return `${sql} output ${this.columnize(columns)}`
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileFunction ({ name, args = [] }) {
    switch (name) {
      case 'trim':
        return `rtrim(ltrim(${this.parameter(first(args))}))`

      case 'substr':
        return this.compileSubstringFunction(...args)

      case 'now':
        return this.cast('getdate()', 'datetime2(0)', true)

      case 'current_date':
        return this.cast('getdate()', 'date', true)

      case 'date':
        return this.cast(first(args), 'date')

      case 'current_time':
        return this.cast('getdate()', 'time(0)', true)

      case 'time':
        return this.cast(first(args), 'time(0)')

      case 'hour':
      case 'minute':
      case 'second':
        return this.compileDatepartFunction(name, first(args))

      case 'utc':
        return this.cast('getutcdate()', 'datetime2(0)', true)

      case 'length':
        return super.compileFunction({ name: 'len', args })

      case 'strpos':
        return super.compileFunction({ name: 'charindex', args: reverse(args.slice())})

      case 'repeat':
        return super.compileFunction({ name: 'replicate', args })

      default:
        return super.compileFunction(arguments[0])
    }
  }

  /**
   * @param {String} part
   * @param {Any} value
   * @returns {String}
   * @private
   */
  compileDatepartFunction (part, value) {
    return `datepart(${part}, ${this.parameter(value)})`
  }

  /**
   * @param {Expression} expr
   * @param {Integer} start
   * @param {Integer} length
   * @returns {String}
   * @private
   */
  compileSubstringFunction (expr, start, length) {
    if (length == null) {
      length = super.compileFunction({ name: 'len', args: [expr]})

      return `substring(${this.parameter(expr)}, ${this.parameter(start)}, ${length})`
    }

    return super.compileFunction({ name: 'substring', args: [expr, start, length]})
  }
}
