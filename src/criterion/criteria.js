
import Criterion from './base'

/**
 * @class CriteriaExpression
 */
export default class Criteria extends Criterion {
  
  /**
   * 
   * @param {String} bool
   * @param {Boolean} negate
   * @constructor
   */
  constructor(bool = 'and', negate = false) {
    super(bool)
    
    this.components = []
    this.negate = negate
  }
  
  /**
   * 
   * @param {Criterion} value
   * @return this
   */
  add(value) {
    if (! (value instanceof Criterion) )
      throw new TypeError("Invalid condition expression")
    
    this.components.push(value)
    
    return this
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @return string
   */
  compile(compiler) {
    // compile the conditions
    var conditions = this.components.map(value => {
      // compile a sub criteria
      if ( value instanceof Criteria ) {
        let not = value.negate ? 'not ' : ''
        let conditions = value.compile(compiler)
        
        return `${value.bool} ${not}(${conditions})`
      }
      
      return value.compile(compiler)
    })
    
    // remove the leading boolean and return the rest
    return conditions.join(' ').substr(3).trim()
  }
  
}