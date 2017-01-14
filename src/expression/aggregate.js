
import { isString } from 'lodash'
import Column from './column'
import Func from './function'

/**
 * @class AggregateExpression
 */
export default class Aggregate extends Func {
  
  /**
   * 
   * @param {String} name
   * @param {String|Expression} expr
   * @constructor
   */
  constructor(name, expr) {
    if ( isString(expr) )
      expr = new Column(expr)
    
    super(name, expr)
    
    this.alias = ''
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
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    return super.isEqual() &&
      expr instanceof Aggregate &&
      expr.alias === this.alias
  }
  
}
