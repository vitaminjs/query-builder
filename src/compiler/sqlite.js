
import Expression from '../expression'
import { isUndefined } from 'lodash'
import Compiler from './base'

/**
 * @class SqliteCompiler
 */
export default class extends Compiler {
  
  /**
   * 
   * @param {Object} options
   * @constructor
   */
  constructor(options = {}) {
    super(options)

    this.paramCount = 1
  }
  
  /**
   * Default parameter placeholder
   * 
   * @type {String}
   */
  get placeholder() {
    return '$' + this.paramCount++
  }

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
   * Escape function name
   * 
   * @param {String} name
   * @param {Array} args
   * @returns {String}
   */
  compileFunction(name, args = []) {
    switch ( name ) {
      case 'concat':
        return this.compileConcatFunction(args)
      
      case 'left':
        return this.compileLeftFunction(...args)
      
      case 'right':
        return this.compileRightFunction(...args)
      
      case 'strpos':
        return super.compileFunction('instr', args)
      
      default:
        return super.compileFunction(name, args)
    }
  }
  
  /**
   * 
   * @param {Expression} expr
   * @param {Integer} length
   * @returns {String}
   */
  compileLeftFunction(expr, length) {
    return `substr(${this.escape(expr)}, 1, ${this.escape(length)})`
  }
  
  /**
   * 
   * @param {Expression} expr
   * @param {Integer} length
   * @returns {String}
   */
  compileRightFunction(expr, length) {
    return `substr(${this.escape(expr)}, -${this.escape(length)})`
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