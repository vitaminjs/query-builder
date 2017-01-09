
import { isString } from 'lodash' 

/**
 * @class Aggregate
 */
export default class {
  
  /**
   * 
   * @param {String} method
   * @param {String|Array} columns
   * @param {String} as
   * @param {Boolean} isDistinct
   * @constructor
   */
  constructor(method, columns, as = null, isDistinct = false) {
    if ( isString(columns) ) columns = columns.split(/\s*,\s*/)
    
    // TODO ensure aggregation method is valid
    
    this.name       = as
    this.method     = method
    this.columns     = columns
    this.isDistinct = isDistinct
  }
  
  compile(compiler = null) {
    // FIXME where to get the dialect
    if (! compiler ) compiler = createCompiler(dialect)
    
    var columns = compiler.columnize(this.columns)
    var distinct = this.isDistinct ? 'distinct ' : ''
    
    return compiler.alias(`${this.method}(${distinct}${columns})`, this.name)
  }
  
}
