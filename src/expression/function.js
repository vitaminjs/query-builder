
import Expression from './base'

/**
 * @class FunctionExpression
 */
export default class Func extends Expression {
  
  /**
   * 
   * @param {String} name
   * @param {Array} args
   * @constructor
   */
  constructor(name, ...args) {
    super()
    
    this.name = name
    this.args = args
  }
  
  /**
   * 
   * @param {Compiler}
   * @returns {String}
   */
  compile(compiler) {
    return compiler.compileFunction(this.name, this.args)
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    return super.isEqual() || ( expr instanceof Func && expr.name === this.name )
  }
  
}
