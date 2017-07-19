
import Compiler from './base'
import Expression from '../expression'
import { isUndefined, first } from 'lodash'

/**
 * @class SqliteCompiler
 */
export default class extends Compiler {
  /**
   * @param {Object}
   * @returns {String}
   * @override
   * @private
   */
  compileLimitClause ({ limit, offset }) {
    if (offset && !limit) {
      return 'limit -1 offset ' + this.parameter(offset)
    }

    return super.compileLimitClause(arguments[0])
  }

  /**
   * @param {Any} value
   * @param {Boolean} setDefault
   * @returns {String}
   * @override
   */
  parameter (value, setDefault = false) {
    // sqlite does not support the `default` keyword,
    // so we replace undefined values with `null` instead
    if (setDefault && isUndefined(value)) return 'null'

    return super.parameter(value)
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileFunction ({ name, args = [] }) {
    switch (name) {
      case 'concat':
        return this.compileConcatFunction(args)

      case 'now':
        return "datetime('now', 'localtime')"

      case 'utc':
        return "datetime('now', 'utc')"

      case 'current_date':
        return "date('now', 'localtime')"

      case 'current_time':
        return "time('now', 'localtime')"

      case 'day':
        return this.compileExtractFunction('%d', first(args))

      case 'hour':
        return this.compileExtractFunction('%H', first(args))

      case 'year':
        return this.compileExtractFunction('%Y', first(args))

      case 'month':
        return this.compileExtractFunction('%m', first(args))

      case 'minute':
        return this.compileExtractFunction('%M', first(args))

      case 'second':
        return this.compileExtractFunction('%S', first(args))

      case 'left':
        return this.compileLeftFunction(...args)

      case 'right':
        return this.compileRightFunction(...args)

      case 'repeat':
        return this.compileRepeatFunction(...args)

      case 'space':
        return this.compileRepeatFunction(' ', first(args))

      case 'rand':
        return '(random() / 18446744073709551616 + .5)'

      case 'strpos':
        return super.compileFunction({ name: 'instr', args })

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
    return this.cast(`strftime('${part}', ${this.parameter(expr)})`, 'integer', true)
  }

  /**
   * @param {String|Expression} expr
   * @param {Integer} count
   * @returns {String}
   * @private
   */
  compileRepeatFunction (expr, count) {
    var p = this.parameter(count)

    // we use an numbered placeholder instead the simple "?".
    // will not be appended in case of expressions.
    p += isNaN(count) ? '' : this.bindings.length

    // escape spaces to support the missing function `space(n)`
    var s = (expr === ' ') ? this.escape(expr) : this.parameter(expr)

    return `replace(substr(quote(zeroblob((${p} + 1) / 2)), 3, ${p}), '0', ${s})`
  }

  /**
   * @param {Expression} expr
   * @param {Integer} length
   * @returns {String}
   * @private
   */
  compileLeftFunction (expr, length) {
    return `substr(${this.parameter(expr)}, 1, ${this.parameter(length)})`
  }

  /**
   * @param {Expression} expr
   * @param {Integer} length
   * @returns {String}
   * @private
   */
  compileRightFunction (expr, length) {
    return `substr(${this.parameter(expr)}, -${this.parameter(length)})`
  }

  /**
   * @param {Array} args
   * @returns {String}
   * @private
   */
  compileConcatFunction (args) {
    return args.map(value => {
      if (value instanceof Expression) {
        return `coalesce(${this.escape(this)}, '')`
      }

      return this.parameter(value)
    }).join(' || ')
  }
}
