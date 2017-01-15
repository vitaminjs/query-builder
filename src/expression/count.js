
import Aggregate from './aggregate'
import { isEqual } from 'lodash'

/**
 * @class CountExpression
 */
export default class Count extends Aggregate {
  
  /**
   * 
   * @param {Array} columns
   * @constructor
   */
  constructor(columns = ['*']) {
    super('count', null)
    
    this.columns = columns
    this.isDistinct = false
  }
  
  /**
   * 
   * @param {Boolean} flag
   * @returns {Count}
   */
  distinct(flag = true) {
    this.isDistinct = flag
    return this
  }
  
  /**
   * 
   * @param {Compiler}
   * @returns {String}
   */
  compile(compiler) {
    var columns = compiler.columnize(this.columns)
    var distinct = this.isDistinct ? 'distinct ' : ''
    
    return compiler.alias(`count(${distinct}${columns})`, this.alias)
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    // TODO compare also the columns
    return expr instanceof Count && expr.alias === this.alias
  }
  
}
