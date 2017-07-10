
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
    return (value === '*') ? value : `[${value.trim().replace(/\]/g, ']]')}]`
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   * @private
   */
  compileSelectColumns ({ columns, limit, offset }) {
    return this.compileTopClause({ limit, offset }) + super.compileSelectColumns({ columns })
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
  compileOrderByClause ({ orders, offset, limit }) {
    let out = super.compileOrderByClause({ orders })

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
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileLimitClause (query) {
    return ''
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   * @private
   */
  compileInsertTable (query) {
    var sql = super.compileInsertTable(query)

    return this.appendOutputClause(sql, query.getReturning())
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileUpdateQuery (query) {
    var table = this.escape(query.getTable())
    var sql = `update ${table} ${this.compileUpdateValues(query)}`

    if (query.hasReturning()) { sql = this.appendOutputClause(sql, query.getReturning()) }

    if (query.hasConditions()) { sql += ` ${this.compileConditions(query)}` }

    return sql
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileDeleteQuery (query) {
    var sql = `delete from ${this.escape(query.getTable())}`

    if (query.hasReturning()) { sql = this.appendOutputClause(sql, query.getReturning(), 'deleted') }

    if (query.hasConditions()) { sql += ` ${this.compileConditions(query)}` }

    return sql
  }

  /**
   * @param {String} sql
   * @param {String} prefix
   * @param {Array} columns
   * @returns {String}
   * @private
   */
  appendOutputClause (sql, columns, prefix = 'inserted') {
    if (isEmpty(columns)) return sql

    // add  the inserted or deleted prefix for each column
    columns = columns.map(value => {
      value = this.escape(value)

      if (value.indexOf('inserted') > -1 || value.indexOf('deleted') > -1) { return value }

      return `${prefix}.${value}`
    })

    return `${sql} output ${columns.join(', ')}`
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileFunction ({ name, args = [], isDistinct = false }) {
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
        return super.compileFunction('len', args)

      case 'strpos':
        return super.compileFunction('charindex', reverse(args.slice()))

      case 'repeat':
        return super.compileFunction('replicate', args)

      default:
        return super.compileFunction({ name, args, isDistinct })
    }
  }

  /**
   * @param {String} part
   * @param {Expression} expr
   * @returns {String}
   * @private
   */
  compileDatepartFunction (part, expr) {
    return `datepart(${part}, ${this.parameter(expr)})`
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
      length = super.compileFunction('len', [expr])

      return `substring(${this.parameter(expr)}, ${this.parameter(start)}, ${length})`
    }

    return super.compileFunction('substring', [expr, start, length])
  }
}
