
import Expression from '../expression'

import {
  each,
  extend,
  compact,
  isArray,
  isEmpty,
  isString, 
  isUndefined
} from 'lodash'

const defaultOptions = {
  autoQuoteIdentifiers: false
}

/**
 * @class BaseCompiler
 */
export default class Compiler {
  /**
   * @param {Object} options
   * @constructor
   */
  constructor (options = {}) {
    this.bindings = []
    this.options = extend({}, defaultOptions, options)
  }

  /**
   * @returns {String}
   */
  placeholder () {
    return '?'
  }

  /**
   * @param {Expression} expr
   * @returns {Object}
   */
  build (expr) {
    return { sql: expr.compile(this), params: this.bindings }
  }

  /**
   * @param {Object} query
   * @returns {String}
   */
  compileSelectQuery (query) {
    var components = [
      this.compileWithClause(query),
      this.compileSelectClause(query),
      this.compileSelectColumns(query),
      this.compileFromClause(query),
      this.compileWhereClause(query),
      this.compileGroupByClause(query),
      this.compileOrderByClause(query),
      this.compileLimitClause(query)
    ]

    return compact(components).join(' ')
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileWithClause ({ commonTables }) {
    // TODO
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileSelectClause ({ isDistinct }) {
    return 'select' + (isDistinct ? ' distinct' : '')
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileSelectColumns ({ columns }) {
    return this.join(isEmpty(columns) ? ['*'] : columns)
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileFromClause ({ tables, joins = [] }) {
    if (isEmpty(tables)) return ''

    return ['from', this.join(tables), this.join(joins)].join(' ')
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileWhereClause ({ conditions }) {
    return isEmpty(conditions) ? '' : 'where ' + this.join(conditions, ' ')
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileGroupByClause ({ groups, havingConditions }) {
    if (isEmpty(groups)) return ''

    let out = 'group by ' + this.join(groups)

    if (!isEmpty(havingConditions)) {
      out += ' having ' + this.join(havingConditions, ' ')
    }

    return out
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileOrderByClause ({ orders }) {
    return isEmpty(orders) ? '' : 'order by ' + this.join(orders)
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileLimitClause ({ limit, offset }) {
    let out = ''

    if (limit) out += 'limit ' + this.parameter(limit)

    if (offset) out += ' offset ' + this.parameter(offset)

    return out.trim()
  }

  /**
   * @param {Object} query
   * @returns {String}
   */
  compileInsertQuery (query) {
    let components = [
      this.compileWithClause(query),
      this.compileInsertClause(query),
      this.compileInsertValues(query)
    ]

    return compact(components).join(' ')
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileInsertClause ({ table, columns }) {
    let out = 'insert into ' + this.escape(table)

    if (!isEmpty(columns)) {
      out += ` (${this.columnize(columns)})`
    }

    return out
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileInsertValues ({ select, values, columns }) {
    // compile select query as insert values
    if (select) return this.escape(select)

    // compile default values
    if (isEmpty(values)) return 'default values'

    return 'values ' + values.map((value) => {
      return `(${columns.map((name) => this.parameter(value[name], true)).join(', ')})`
    }).join(', ')
  }

  /**
   * @param {Object} query
   * @returns {String}
   */
  compileUpdateQuery (query) {
    let components = [
      this.compileWithClause(query),
      this.compileUpdateClause(query),
      this.compileSetClause(query),
      this.compileWhereClause(query)
    ]

    return compact(components).join(' ')
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileUpdateClause ({ table }) {
    return 'update ' + this.escape(table)
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileSetClause ({ values = [] }) {
    let expr = []

    each(values.reduce(extend, {}), (value, key) => {
      expr.push(`${key} = ${this.parameter(value, true)}`)
    })

    return 'set ' + expr.join(', ')
  }

  /**
   * @param {Object} query
   * @returns {String}
   */
  compileDeleteQuery (query) {
    let components = [
      this.compileWithClause(query),
      this.compileDeleteClause(query),
      this.compileWhereClause(query)
    ]

    return compact(components).join(' ')
  }

  /**
   * @param {Object}
   * @returns {String}
   */
  compileDeleteClause ({ table }) {
    return 'delete from ' + this.escape(table)
  }

  /**
   * @param {Object}
   * @returns {String}
   */
  compileFunction ({ name, args = [], isDistinct = false }) {
    return `${name}(${isDistinct ? 'distinct ' : ''}${this.parameterize(args)})`
  }

  /**
   * @param {Object}
   * @returns {String}
   */
  compileJoin ({ table, conditions, columns }) {
    let sql = `${this.type} join ${this.escape(table)}`

    if (!isEmpty(conditions)) sql += ' on ' + this.compileConditions(conditions)

    if (!isEmpty(columns)) sql += ` using (${this.columnize(columns)})`

    return sql
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   */
  compileCriteria ({ expr, prefix, negate }) {
    return `${prefix} ${negate ? `not (${this.escape(expr)})` : this.escape(expr)}`
  }

  /**
   * @param {Object} expr
   * @returns {String}
   */
  compileIdentifier ({ name }) {
    if (this.options.autoQuoteIdentifiers === false) return name

    return name.split('.').map((part) => this.quote(part)).join('.')
  }

  /**
   * @param {Object}
   * @returns {String}
   */
  compileLiteral ({ expr, values }) {
    let i = 0

    return expr.replace(/\?(\d*)/g, (_, p) => {
      return this.parameterize(values[p ? p - 1 : i++])
    })
  }

  /**
   * @param {Object}
   * @returns {String}
   */
  compileAlias ({ value, name, columns, isCTE = false }) {
    let expr = this.escape(value)
    let alias = this.compileIdentifier({ name })

    // compile the table name columns
    if (!isEmpty(columns)) {
      alias += ` (${this.columnize(columns)})`
    }

    return isCTE ? `${alias} as ${expr}` : `${expr} as ${alias}`
  }

  /**
   * @param {Array} value
   * @returns {String}
   */
  compileConditions (value) {
    return value.map((cnd) => this.escape(cnd)).join(' ').substr(3).trim()
  }

  /**
   * @param {Any} value
   * @param {String} type
   * @param {Boolean} isLiteral
   * @returns {String}
   */
  cast (value, type, isLiteral = false) {
    return `cast(${isLiteral ? value : this.parameter(value)} as ${type})`
  }

  /**
   * @param {Array} columns
   * @returns {String}
   */
  columnize (columns) {
    return columns.map((name) => this.compileIdentifier({ name })).join(', ')
  }

  /**
   * @param {Any} value
   * @returns {String}
   */
  parameterize (value) {
    if (!isArray(value)) return this.parameter(value)

    return value.map((item) => this.parameter(item)).join(', ')
  }

  /**
   * @param {Any} value
   * @param {Boolean} replaceUndefined
   * @returns {String}
   */
  parameter (value, setDefault = false) {
    if (value === '*') return value

    // escape expressions
    if (value instanceof Expression) return value.compile(this)

    // replace undefined values with `default` placeholder
    if (setDefault && isUndefined(value)) return 'default'

    return this.addBinding(value).placeholder()
  }

  /**
   * @param {Any} value
   * @returns {Compiler}
   * @throws {TypeError}
   */
  addBinding (value) {
    if (!isUndefined(value)) {
      this.bindings.push(value)
      return this
    }

    throw new TypeError('Invalid parameter value')
  }

  /**
   * @param {String} value
   * @returns {String}
   */
  quote (value) {
    return value === '*' ? value : `"${value.trim().replace(/"/g, '""')}"`
  }

  /**
   * @param {Any} value
   * @returns {String}
   */
  escape (value) {
    if (value === '*') return value

    // escape expressions
    if (value instanceof Expression) return value.compile(this)

    if (isString(value)) value = `'${value.replace(/'/g, "''")}'`

    return value
  }

  /**
   * @param {Array} list
   * @param {String} glue
   * @returns {String}
   * @private
   */
  join (list, glue = ', ') {
    return list.map((value) => this.escape(value)).join(glue)
  }
}
