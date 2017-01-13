
import { isString, isEqual } from 'lodash'
import Expression from './base'

/**
 * @class AggregateExpression
 */
export default class Aggregate extends Expression {
  
  /**
   * 
   * @param {String} method
   * @param {String|Array} columns
   * @param {Boolean} isDistinct
   * @constructor
   */
  constructor(method, columns, isDistinct = false) {
    super()
    
    var as = ''
    
    if ( isString(columns) ) {
      if ( !as && columns.toLowerCase().indexOf(' as ') > 0 )
        [columns, as] = columns.split(' as ').map(str => str.trim())
      
      columns = columns.split(/\s*,\s*/)
    }
    
    // TODO ensure aggregation method is valid
    
    this.name       = as
    this.method     = method
    this.columns    = columns
    this.isDistinct = isDistinct
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var columns = compiler.columnize(this.columns)
    var distinct = this.isDistinct ? 'distinct ' : ''
    
    return compiler.alias(`${this.method}(${distinct}${columns})`, this.name)
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
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
