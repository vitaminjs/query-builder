
import Result from './result'

import {
  each,
  first,
  extend,
  compact,
  isArray,
  isEmpty,
  isString,
  isFunction,
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
  constructor (options) {
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
   * @param {Compilable} expr
   * @returns {Result}
   */
  build (expr) {
    return new Result(expr.compile(this), this.bindings)
  }

  /**
   * @param {Object} query
   * @returns {String}
   */
  compileSelectQuery (query) {
    var components = [
      this.compileWithClause(query),
      this.compileSelectClause(query),
      this.compileFromClause(query),
      this.compileWhereClause(query),
      this.compileGroupByClause(query),
      this.compileUnionClause(query),
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
  compileWithClause ({ cte }) {
    if (isEmpty(cte)) return ''

    return 'with ' + this.join(cte)
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileSelectClause ({ isDistinct, fields }) {
    if (isEmpty(fields)) fields = ['*']

    return `select ${isDistinct ? 'distinct ' : ''}${this.join(fields)}`
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileFromClause ({ table, joins }) {
    if (!table) return ''

    let out = 'from ' + this.escape(table)

    if (!isEmpty(joins)) {
      out += ` ${this.join(joins, ' ')}`
    }

    return out
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileWhereClause ({ wheres }) {
    if (isEmpty(wheres)) return ''

    return 'where ' + this.compileConditions(wheres)
  }

  /**
   * @param {Object}
   * @returns {String}
   * @private
   */
  compileGroupByClause ({ groups, havings }) {
    if (isEmpty(groups)) return ''

    let out = 'group by ' + this.join(groups)

    if (!isEmpty(havings)) {
      out += ' having ' + this.compileConditions(havings)
    }

    return out
  }

  /**
   * @param {Object}
   * @returns {String}
   */
  compileUnionClause ({ unions = [] }) {
    return this.join(unions, ' ')
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
  compileInsertValues ({ values, columns }) {
    // compile select query as insert values
    if (!isArray(values)) return this.escape(values)

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

    // throw an error when the values array is empty
    if (isEmpty(values)) {
      throw new TypeError('Empty values for update query')
    }

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
   * @private
   */
  compileDeleteClause ({ table }) {
    return 'delete from ' + this.escape(table)
  }

  /**
   * @param {Object}
   * @returns {String}
   */
  compileFunction ({ name, args = [] }) {
    return `${name}(${this.parameterize(args)})`
  }

  /**
   * @param {Object}
   * @returns {String}
   */
  compileJoin ({ table, type, wheres, columns }) {
    let sql = `${type} join ${this.escape(table)}`

    if (!isEmpty(wheres)) {
      sql += ` on (${this.compileConditions(wheres)})`
    }

    if (!isEmpty(columns) && isEmpty(wheres)) {
      sql += ` using (${this.columnize(columns)})`
    }

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
  compileAlias ({ value, name, columns }) {
    let alias = this.compileIdentifier({ name })

    // compile the table name columns
    if (!isEmpty(columns)) {
      alias += ` (${this.columnize(columns)})`
    }

    return `${this.escape(value)} as ${alias}`
  }

  /**
   * @param {Object}
   * @returns {String}
   */
  compileTable ({ name, joins }) {
    if (isEmpty(joins)) return this.escape(name)

    return `(${this.escape(name)} ${this.join(joins, ' ')})`
  }

  /**
   * @param {Object}
   * @returns {String}
   */
  compileOrder ({ expr, direction, nulls }) {
    let out = `${this.escape(expr)} ${direction === 'desc' ? 'desc' : 'asc'}`

    if (nulls === false) return out

    return `${this.escape(expr)} is ${nulls === 'last' ? 'not ' : ''}null, ${out}`
  }

  /**
   * @param {Object}
   * @returns {String}
   */
  compileValues ({ values = [] }) {
    if (!isArray(first(values))) {
      return `values (${this.parameterize(values)})`
    }

    return 'values ' + values.map((value) => `(${this.parameterize(value)})`).join(', ')
  }

  /**
   * @param {Object}
   * @returns {String}
   */
  compileUnion ({ query, filter }) {
    return 'union ' + (filter === 'all' ? 'all ' : '') + this.escape(query)
  }

  /**
   * @param {Object}
   * @returns {String}
   */
  compileCommonTable ({ expr, name, columns }) {
    let alias = this.compileIdentifier({ name })

    if (!isEmpty(columns)) {
      alias += ` (${this.columnize(columns)})`
    }

    return `${alias} as (${this.escape(expr)})`
  }

  /**
   * @param {Array} value
   * @returns {String}
   * @private
   */
  compileConditions (value) {
    return this.join(value, ' ').substr(3).trim()
  }

  /**
   * @param {Any} value
   * @param {String} type
   * @param {Boolean} isLiteral
   * @returns {String}
   * @private
   */
  cast (value, type, isLiteral = false) {
    return `cast(${isLiteral ? value : this.parameter(value)} as ${type})`
  }

  /**
   * @param {Array} columns
   * @returns {String}
   * @private
   */
  columnize (columns) {
    return columns.map((name) => this.compileIdentifier({ name })).join(', ')
  }

  /**
   * @param {Any} value
   * @returns {String}
   * @private
   */
  parameterize (value) {
    if (!isArray(value)) return this.parameter(value)

    return value.map((item) => this.parameter(item)).join(', ')
  }

  /**
   * @param {Any} value
   * @param {Boolean} replaceUndefined
   * @returns {String}
   * @private
   */
  parameter (value, setDefault = false) {
    // escape expressions
    if (value && isFunction(value.compile)) return value.compile(this)

    // replace undefined values with `default` placeholder
    if (setDefault && isUndefined(value)) return 'default'

    return this.addBinding(value).placeholder()
  }

  /**
   * @param {Any} value
   * @returns {Compiler}
   * @throws {TypeError}
   * @private
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
   * @private
   */
  quote (value) {
    return (value === '*') ? value : `"${value.replace(/"/g, '""')}"`
  }

  /**
   * @param {Any} value
   * @returns {String}
   * @private
   */
  escape (value) {
    if (value === '*') return value

    // escape expressions
    if (isFunction(value.compile)) return value.compile(this)

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
