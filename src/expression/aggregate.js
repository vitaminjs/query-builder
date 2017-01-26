
import Func from './function'

/**
 * @class AggregateExpression
 */
export default class Aggregate extends Func {
  
  /**
   * 
   * @param {String} name
   * @param {Array} columns
   * @constructor
   */
  constructor(name, columns) {
    super(name, columns)
    
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
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var columns = compiler.columnize(this.columns)
    var distinct = this.isDistinct ? 'distinct ' : ''
    
    return compiler.alias(`${this.name}(${distinct}${columns})`, this.alias)
  }
  
  /**
   * 
   * @param {Expression} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    // TODO compare also the columns
    return super.isEqual() && expr instanceof Aggregate && expr.alias === this.alias
  }
  
}
