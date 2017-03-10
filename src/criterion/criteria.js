
import { each, isPlainObject, isFunction, isString, isBoolean, isNumber } from 'lodash'
import Expression, { Literal } from '../expression'
import Between from './between'
import Criterion from './base'
import Basic from './basic'
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
    this._components = []
  }
  
  /**
   * 
   * @returns {Criteria}
   */
  clone() {
    return new Criteria().setComponents(this.getComponents())
  }
  
  /**
   * 
   * @returns {Array}
   */
  getComponents() {
    return this._components
  }
  
  /**
   * 
   * @param {Array} value
   * @returns {Criteria}
   */
  setComponents(value) {
    this._components = value
    return this
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
    return this.getComponents().length === 0
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

    this.getComponents().push(value.setBoolean(bool))
    
    return this
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    // compile the conditions
    var conditions = this.getComponents().map(child => {
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
      expr = new Literal(`1 = ${expr && !not ? 1 : 0}`)
    
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
      
      expr = cr => each(obj, (v, k) => cr.where(k, v))
    }
    
    // supports `.where(cr => { ... })`
    if ( isFunction(expr) ) {
      let fn = expr
      
      fn(expr = new Criteria())
    }

    // supports `.where(criterion)`
    if ( expr instanceof Criterion )
      return this.add(expr, bool, not)
    
    if ( value === undefined && operator !== undefined ) {
      value = operator
      operator = '='
    }

    // supports `.where('column', 'between', [val1, val2])`
    if ( ~operator.toLowerCase().trim().indexOf('between') )
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