
import { isUndefined, first } from 'lodash'
import Expression from '../expression'
import Compiler from './base'

/**
 * @class SqliteCompiler
 */
export default class extends Compiler {
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileLimit(query) {
    if ( query.hasOffset() && !query.hasLimit() )
      return 'limit -1'
    
    return super.compileLimit(query)
  }

  /**
   * 
   * @param {Any} value
   * @param {Boolean} replaceUndefined
   * @returns {String}
   */
  parameter(value, replaceUndefined = false) {
    // sqlite does not support the `default` keyword,
    // so we replace undefined values with `null` instead
    if ( replaceUndefined && isUndefined(value) )
      return 'null'

    return super.parameter(value, replaceUndefined)
  }
  
  /**
   * Compile the function name and its arguments
   * 
   * @param {String} name
   * @param {Array} args
   * @returns {String}
   */
  compileFunction(name, args = []) {
    switch ( name ) {
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

      case 'year':
        return this.compileExtractFunction('%Y', first(args))

      case 'month':
        return this.compileExtractFunction('%m', first(args))
      
      case 'left':
        return this.compileLeftFunction(...args)
      
      case 'right':
        return this.compileRightFunction(...args)
      
      case 'repeat':
        return this.compileRepeatFunction(...args)
      
      case 'space':
        return this.compileRepeatFunction(' ', first(args))
      
      case 'rand':
        return '(random() / 18446744073709551616 + 0.5)'
      
      case 'strpos':
        return super.compileFunction('instr', args)
      
      default:
        return super.compileFunction(name, args)
    }
  }

  /**
   * 
   * @param {String} part
   * @param {Any} expr
   * @returns {String}
   */
  compileExtractFunction(part, expr) {
    return this.cast(`strftime('${part}', ${this.parameter(expr)})`, 'integer', true)
  }

  /**
   * 
   * @param {String|Expression} expr
   * @param {Integer} count
   * @returns {String}
   */
  compileRepeatFunction(expr, count) {
    var n = this.parameter(count)

    // we use an indexed placeholder instead of a new parameter
    // will not be appended in case of expressions
    var i = isNaN(count) ? '' : this.bindings.length

    // escape spaces to support also the missing function `space(n)`
    var s = (expr === ' ') ? this.escape(expr) : this.parameter(expr)
    
    return `replace(substr(quote(zeroblob((${n} + 1) / 2)), 3, ${n+i}), '0', ${s})`
  }
  
  /**
   * 
   * @param {Expression} expr
   * @param {Integer} length
   * @returns {String}
   */
  compileLeftFunction(expr, length) {
    return `substr(${this.parameter(expr)}, 1, ${this.parameter(length)})`
  }
  
  /**
   * 
   * @param {Expression} expr
   * @param {Integer} length
   * @returns {String}
   */
  compileRightFunction(expr, length) {
    return `substr(${this.parameter(expr)}, -${this.parameter(length)})`
  }
  
  /**
   * 
   * @param {Array} args
   * @returns {String}
   */
  compileConcatFunction(args) {
    return args.map(value => {
      if ( value instanceof Expression )
        return `coalesce(${value.compile(this)}, '')`
      
      return this.escape(value)
    }).join(' || ')
  }
  
}