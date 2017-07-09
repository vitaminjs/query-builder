
import Expression from '../expression'
import { extend, isString, isUndefined, isObject, isArray, isEmpty } from 'lodash'

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
   * @param {Expression} query
   * @returns {Object}
   */
  build (expr) {
    return { sql: expr.compile(this), params: this.bindings }
  }

  /**
   * @param {Object} query
   * @returns {String}
   * @todo
   */
  compileSelectQuery (query) {
    return ''
  }

  /**
   * @param {Object}
   * @returns {String}
   */
  compileFunction ({ name, args = [], isDistinct = false }) {
    let distinct = isDistinct ? 'distinct ' : ''

    return `${name}(${distinct}${this.parameterize(args)})`
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
    return `${prefix}${negate ? ' not' : ''} (${this.escape(expr)})`
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
    values = values.slice()

    return expr.replace(/\??/g, () => this.parameterize(values.shift()))
  }

  /**
   * @param {Object}
   * @returns {String}
   */
  compileAlias ({ value, name, columns = [] }) {
    let alias = this.compileIdentifier({ name })

    // compile the table name columns
    if (columns.length > 0) {
      let ids = columns.map((name) => this.compileIdentifier({ name }))

      alias += ` (${ids.join(', ')})`
    }

    return `${this.escape(value)} as ${alias}`
  }

  /**
   * @param {Array} value
   * @returns {String}
   */
  compileConditions (value) {
    return value.map((cnd) => this.escape(cnd)).join(' ').substr(3).trim()
  }

  /**
   * @param {Array} columns
   * @returns {String}
   */
  columnize (columns) {
    return columns.map((expr) => this.escape(expr)).join(', ')
  }

  /**
   * @param {Any} value
   * @returns {String}
   */
  parameterize (value) {
    if (!isArray(value)) return this.parameter(value)
    // TODO
  }

  /**
   * @param {Any} value
   * @param {Boolean} replaceUndefined
   * @returns {String}
   */
  parameter (value, replaceUndefined = false) {
    // escape expressions
    if (value instanceof Expression) return value.compile(this)

    // replace undefined values with `default` placeholder
    if (replaceUndefined && isUndefined(value)) return 'default'

    return this.addBinding(value).placeholder()
  }

  /**
   * @param {Any} value
   * @returns {Compiler}
   */
  addBinding (value) {
    if (isUndefined(value) || isObject(value)) {
      throw new TypeError('Invalid parameter value')
    }

    this.bindings.push(value)

    return this
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
}
