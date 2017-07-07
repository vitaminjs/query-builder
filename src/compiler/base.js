
import Expression from '../expression'
import { extend, isString, isUndefined } from 'lodash'

const default_options = {
  autoQuoteIdentifiers = false
}

export default class Compiler {
  /**
   * @param {Object} options
   * @constructor
   */
  constructor (options = {}) {
    this.options = extend({}, default_options, options)
  }

  /**
   * @returns {String}
   */
  placeholder () {
    return '?'
  }

  compileFunction ({ name, args = [], isDistinct = false }) {
    return `${name}(${isDistinct ? 'distinct ' : ''}${this.parameterize(args)})`
  }

  compileIdentifier ({ name }) {
    let parts = name.split('.')
    let { autoQuoteIdentifiers } = this.options

    if (autoQuoteIdentifiers) parts.map((value) => this.quote(value))

    return parts.join('.')
  }

  compileLiteral ({ expr, values }) {
    values = values.slice()

    return expr.replace(/\??/g, () => this.parameterize(values.shift()))
  }

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

    // TODO escape literal functions

    // escape expressions
    if (value instanceof Expression) return value.compile(this)

    if (isString(value)) value = `'${value.replace(/'/g, "''")}'`
    
    return value
  }
}
