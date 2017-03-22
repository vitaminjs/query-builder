
import { isString, isEqual, isPlainObject, isUndefined } from 'lodash'
import Expression from './base'

/**
 * @class LiteralExpression
 */
export default class Literal extends Expression {
  
  /**
   * 
   * @param {String} expr
   * @param {Object} values
   * @constructor
   */
  constructor(expr, values = []) {
    super()
    
    this.values = values
    this.expr = expr
    this.before = ''
    this.after = ''
  }

  /**
   * 
   * @param {String|Expression} value
   * @returns {Literal}
   */
  static from(value) {
    return new Literal(value.toString())
  }
  
  /**
   * 
   * @param {String} before
   * @param {String} after
   * @returns {Raw}
   */
  wrap(before = '(', after = ')') {
    this.before = before
    this.after = after
    return this
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    // replace named parameters with 
    if ( isPlainObject(this.values) ) {
      let obj = this.values
      this.values = []

      this.expr = this.expr.replace(/(:\w)/gi, (_, name) => {
        if ( isUndefined(obj[name]) ) return name
        
        this.values.push(obj[name])
        return '?'
      })
    }
    
    var values = this.values.slice()
    var expr = this.expr.replace(/\?\??/g, () => {
      return compiler.parameterize(values.shift())
    })
    
    return compiler.alias(this.before + expr + this.after, this.alias)
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    if ( isString(expr) )
      return (this.expr === expr || this.alias === expr)

    // TODO compare also the values

    return super.isEqual() || (
      expr instanceof Literal &&
      expr.expr === this.expr &&
      expr.alias === this.alias
    )
  }

  /**
   * 
   * @returns {String}
   */
  toString() {
    return this.expr
  }
  
}