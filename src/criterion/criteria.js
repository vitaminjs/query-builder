
import { each, isPlainObject, isArray, isFunction, isString, isBoolean, isNumber } from 'lodash'
import Expression, { Literal } from '../expression'
import Between from './between'
import Criterion from './base'
import IsNull from './is-null'
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
   * @throws {TypeError}
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
   * @throws {TypeError}
   */
  where(expr, operator, value, bool = 'and', not = false) {
    // supports `.where(true|false)`
    if ( isBoolean(expr) )
      expr = new Literal(`1 = ${expr ? 1 : 0}`)
    
    // supports `.where(new Literal(...))`
    if ( expr instanceof Literal )
      return this.add(new Raw(expr), bool)
    
    // supports scalar conditions
    if ( isNumber(expr) )
      expr = String(expr)
    
    // each string expression will be wrapped into a Literal
    if ( isString(expr) )
      expr = new Literal(expr)
    
    // supports `.where({a: 1, b: 3})`
    if ( isPlainObject(expr) ) {
      let obj = expr
      
      expr = cr => each(obj, (val, key) => cr.where(key, '=', val))
    }
    
    // supports `.where(cr => { ... })`
    if ( isFunction(expr) ) {
      let fn = expr
      
      fn(expr = new Criteria())
    }

    // supports `.where(criterion)`
    if ( expr instanceof Criterion )
      return this.add(expr, bool, not)
    
    if ( value == null && operator != null ) {
      value = operator
      operator = '='
    }

    // format the operator
    operator = operator.toLowerCase().trim()

    // supports `.where('column', null)`
    if ( value === null )
      return this.add(new IsNull(expr), bool, not)
    
    // supports `.where('column', [...])`
    if ( isArray(value) && operator === '=' ) operator = 'in'

    // supports `.where('column', 'in', ...)`
    if ( operator.indexOf('in') > -1 )
      return this.add(new IsIn(expr, value), bool, not)
    
    // supports `.where('column', 'between', [val1, val2])`
    if ( operator.indexOf('between') > -1 )
      return this.add(new Between(expr, value), bool, not)

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
  
}