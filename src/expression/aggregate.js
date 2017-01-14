
import Func from './function'

/**
 * @class AggregateExpression
 */
export default class Aggregate extends Func {
  
  /**
   * 
   * @param {String} name
   * @param {Expression} expr
   * @constructor
   */
  constructor(name, expr) {
    super(name, expr)
    
    this.alias = ''
    this.column = expr
  }
  
  /**
   * 
   * @param {String} name
   * @returns {Count}
   */
  as(name) {
    this.alias = name
    return this
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return compiler.alias(super.compile(compiler), this.alias)
  }
  
  /**
   * 
   * @param {Expression} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    return super.isEqual() && 
      expr instanceof Aggregate &&
      expr.alias === this.alias &&
      this.column.isEqual(expr.column)
  }
  
}
