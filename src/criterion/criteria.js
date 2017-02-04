
import { each, isPlainObject, isArray, isFunction, isString, isBoolean, isNumber } from 'lodash'
import Expression, { Literal } from '../expression'
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
   * @constructor
   */
  constructor() {
    super()
    
    this.not = false
    this.components = []
  }

  /**
   * 
   * @returns {Criteria}
   */
  negate() {
    this.not = !this.not
    return this
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
   * @param {String} bool
   * @param {Boolean} not
   * @returns {Criteria}
   */
  add(value, bool = 'and', not = false) {
    if (! (value instanceof Criterion) )
      throw new TypeError("Invalid condition expression")
    
    if ( not ) value.negate()

    this.components.push(value.setBoolean(bool))
    
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
    
    if ( isBoolean(expr) )
      expr = new Literal(`1 = ${expr ? 1 : 0}`)
    
    if ( isNumber(expr) )
      expr = String(expr)
    
    if ( isString(expr) )
      expr = new Literal(expr)
    
    // supports `.where(new RawExpr(...))`
    if ( expr instanceof Literal )
      return this.add(new Raw(expr), bool)
    
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
      return this.add(expr, bool, not)
    
    // supports `.where('column', [...])`
    if ( isArray(value) && operator === '=' )
      return this.add(new IsIn(expr, value), bool, not)

    return this.add(new Basic(expr, operator, value), bool, not)
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
      value = new Literal(value)
    
    if (! (value instanceof Expression) )
      throw new TypeError("Invalid column expression")
    
    return this.where(expr, operator, value, bool)
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