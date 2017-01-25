
import { each, isPlainObject, isArray, isFunction, isString, isObject } from 'lodash'
import Expression, { Literal, Column } from '../expression'
import { SQ } from '../helpers'
import Criterion from './base'
import Basic from './basic'
import IsIn from './is-in'
import Raw from './raw'

/**
 * @class CriteriaExpression
 */
export default class Criteria extends Criterion {
  
  /**
   * 
   * @param {String} bool
   * @param {Boolean} not
   * @constructor
   */
  constructor(bool = 'and', not = false) {
    super(bool, not)
    
    this.components = []
  }

  /**
   * 
   * @returns {Boolean}
   */
  isEmpty() {
    return this.components.length === 0
  }
  
  /**
   * 
   * @param {Criterion} value
   * @returns {Criteria}
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
   * @returns {String}
   */
  compile(compiler) {
    // compile the conditions
    var conditions = this.components.map(child => {
      // compile a sub criteria
      if ( child instanceof Criteria ) {
        let not = child.not ? 'not ' : ''
        let conditions = child.compile(compiler)
        
        return `${child.bool} ${not}(${conditions})`
      }
      
      return child.compile(compiler)
    })
    
    // remove the leading boolean and return the rest
    return conditions.join(' ').substr(3).trim()
  }
  
  /**
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @param {Boolean} not
   * @returns {Criteria}
   */
  where(expr, operator, value, bool = 'and', not = false) {
    if ( value == null && operator != null ) {
      value = operator
      operator = '='
    }
    
    // supports `.where(new RawExpr(...))`
    if ( expr instanceof Literal )
      return this.add(new Raw(expr, bool))
    
    // supports `.where({a: 1, b: 3})`
    if ( isPlainObject(expr) ) {
      let obj = expr
      
      expr = cr => each(obj, (val, key) => cr.where(key, '=', val))
    }
    
    // supports `.where(cr => { ... })`
    if ( isFunction(expr) ) {
      let fn = expr
      
      fn(expr = new Criteria(bool, not))
    }

    // supports `.where(criterion)`
    if ( expr instanceof Criterion )
      return this.add(expr.negate(not).setBoolean(bool))
    
    // supports `.where('column', [...])`
    if ( isArray(value) && operator === '=' )
      return this.add(new IsIn(expr, value, bool, not))
    
    // supports sub queries
    if ( isFunction(value) ) value = SQ(value)

    return this.add(new Basic(expr, operator, value, bool, not))
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @returns {Criteria}
   */
  orWhere(expr, operator, value) {
    return this.where(expr, operator, value, 'or')
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @returns {Criteria}
   */
  whereNot(expr, operator, value, bool = 'and') {
    return this.where(expr, operator, value, bool, true)
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @returns {Criteria}
   */
  orWhereNot(expr, operator, value) {
    return this.whereNot(expr, operator, value, 'or')
  }
  
  /**
   * 
   * @param {String|Expression} expr
   * @param {String} operator
   * @param {String|Expression} value
   * @param {String} bool
   * @returns {Criteria}
   */
  on(expr, operator, value, bool = 'and') {
    if ( value == null && operator != null ) {
      value = operator
      operator = '='
    }
    
    if ( isString(value) )
      value = new Column(value)
    
    if (! (value instanceof Expression) )
      throw new TypeError("Invalid column expression")
    
    return this.add(new Basic(expr, operator, value, bool))
  }
  
  /**
   * 
   * @param {String|Expression} expr
   * @param {String} operator
   * @param {String|Expression} value
   * @returns {Criteria}
   */
  orOn(expr, operator, value) {
    return this.on(expr, operator, value, 'or')
  }
  
}