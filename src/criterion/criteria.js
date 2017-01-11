
import { IsNull, Basic, IsIn, Raw, Sub, Between, Exists } from './index'
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
    this.not = negate ? 'not ' : ''
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
   * @param {String|Column} expr
   * @param {Array} values
   * @param {String} bool
   * @param {Boolean} not
   * @return this
   */
  whereBetween(expr, values, bool = 'and', not = false) {
    return this.add(new Between(expr, values, bool, not))
  }
  
  /**
   * 
   * @param {SubQuery} query
   * @param {String} bool
   * @param {Boolean} not
   * @return this
   */
  whereExists(query, bool = 'and', not = false) {
    return this.add(new Exists(query, bool, not))
  }
  
  /**
   * 
   * @param {RawExpression} expr
   * @param {String} bool
   * @return this
   */
  whereRaw(expr, bool = 'and') {
    return this.add(new Raw(expr, bool))
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {String} bool
   * @param {Boolean} not
   * @return this
   */
  whereNull(expr, bool = 'and', not = false) {
    return this.add(new IsNull(expr, bool, not))
  }
  
  /**
   * @param {String|Column} expr
   * @param {Array|SubQuery} values
   * @param {String} bool
   * @param {Boolean} not
   * @return this
   */
  whereIn(expr, values, bool = 'and', not = false) {
    return this.add(new IsIn(expr, values, bool, not))
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {String} operator
   * @param {Any} query
   * @param {String} bool
   * @return this
   */
  whereSub(expr, operator, query, bool = 'and') {
    return this.add(new Sub(expr, operator, query, bool))
  }
  
  /**
   * @param {String|Column} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @param {Boolean} not
   * @return this
   */
  where(expr, operator, value, bool = 'and', not = false) {
    return this.add(new Basic(expr, operator, value, bool, not))
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @return string
   */
  compile(compiler) {
    // compile the conditions
    var conditions = this.components.map(child => {
      // compile a sub criteria
      if ( child instanceof Criteria ) {
        let conditions = child.compile(compiler)
        
        return `${child.bool} ${child.not}(${conditions})`
      }
      
      return child.compile(compiler)
    })
    
    // remove the leading boolean and return the rest
    return conditions.join(' ').substr(3).trim()
  }
  
}