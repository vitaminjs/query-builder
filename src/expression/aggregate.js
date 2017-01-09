
import { isString, isEqual } from 'lodash'
import Expression from './base'

/**
 * @class Aggregate
 */
export default class Aggregate extends Expression {
  
  /**
   * 
   * @param {String} method
   * @param {String|Array} columns
   * @param {String} as
   * @param {Boolean} isDistinct
   * @constructor
   */
  constructor(method, columns, as = null, isDistinct = false) {
    super()
    
    if ( isString(columns) ) columns = columns.split(/\s*,\s*/)
    
    // TODO ensure aggregation method is valid
    
    this.name       = as
    this.method     = method
    this.columns     = columns
    this.isDistinct = isDistinct
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @return string
   */
  compile(compiler) {
    var columns = compiler.columnize(this.columns)
    var distinct = this.isDistinct ? 'distinct ' : ''
    
    return compiler.alias(`${this.method}(${distinct}${columns})`, this.name)
  }
  
  /**
   * 
   * @param {Any} expr
   * @return boolean
   */
  isEqual(expr) {
    return super.isEqual() || (
      expr instanceof Aggregate &&
      expr.name === this.name &&
      expr.method === this.method &&
      expr.isDistinct === this.isDistinct &&
      isEqual(expr.columns, this.columns)
    )
  }
  
}
