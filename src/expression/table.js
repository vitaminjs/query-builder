
import { isString } from 'lodash'
import Expression from './base'
import Column from './column'

/**
 * @class TableExpression
 */
export default class Table extends Expression {
  
  /**
   * 
   * @param {String} name
   * @constructor
   */
  constructor(name) {
    super()
    
    this.name = name
  }

  /**
   * 
   * @returns {String}
   */
  getName() {
    return this.alias || this.name
  }

  /**
   * 
   * @param {String} column
   * @returns {Column}
   */
  column(name) {
    return new Column(this.getName() +'.'+ name)
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var expr = this.name.split('.').map(s => compiler.quote(s)).join('.')
    
    return compiler.alias(expr, this.alias)
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    if ( isString(expr) )
      return expr === this.getName()

    return super.isEqual() || (
      expr instanceof Table && this.getName() === expr.getName()
    )
  }
  
}
