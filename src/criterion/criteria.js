
import { each, isBoolean, isEmpty, isPlainObject, isArray, isFunction, isString, isObject } from 'lodash'
import Criterion, { IsNull, Basic, IsIn, Raw, Between, Exists } from './index'
import Expression, { Raw as RawExpr, Column } from '../expression'
import { SQ, RAW } from '../helpers'

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
    super(bool)
    
    this.components = []
    this.negate = not ? 'not ' : ''
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
        let conditions = child.compile(compiler)
        
        return `${child.bool} ${child.negate}(${conditions})`
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
    
    // supports `.where(Boolean)`
    if ( isBoolean(expr) )
      expr = RAW`1 = ${expr ? 1 : 0}`
    
    // supports `.where(new RawExpr(...))`
    if ( expr instanceof RawExpr )
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
      return this.add(expr)
    
    // format the operator
    operator = String(operator).toLowerCase().trim()
    
    // supports between operator
    if ( operator.indexOf('between') > -1 )
      return this.between(expr, value, bool, not)
    
    // supports `.where('column', null)`
    if ( value === null )
      return this.isNull(expr, bool, not)
    
    // supports `.where('column', [...])`
    if ( isArray(value) && operator === '=' )
      return this.in(expr, value, bool, not)
    
    // supports sub queries
    if ( isFunction(value) || isObject(value) )
      value = SQ(value)

    return this.add(new Basic(expr, operator, value, bool, not))
  }
  
  /**
   * @see where()
   */
  and() {
    return this.where(...arguments)
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @returns {Criteria}
   */
  or(expr, operator, value) {
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
  not(expr, operator, value, bool = 'and') {
    var not = true
    
    if ( value == null && operator != null ) {
      value = operator
      operator = '='
    }
    
    // format the operator
    operator = String(operator).toLowerCase().trim()
    
    // supports `.whereNot('column', 'between', [...])`
    if ( operator === 'between' )
      return this.between(expr, operator, value, bool, not)
    
    // supports `.whereNot('column', 'in', [...])`
    if ( operator === 'in' )
      return this.in(expr, operator, value, bool, not)
    
    // supports `.whereNot('column', 'like', 'patern')`
    if ( operator === 'like' ) {
      operator = 'not like'
      not = false
    }
    
    return this.where(expr, operator, value, bool, not)
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @returns {Criteria}
   */
  orNot(expr, operator, value) {
    return this.not(expr, operator, value, 'or')
  }
  
  /**
   * 
   * @param {String|Expression} expr
   * @param {Array} values
   * @param {String} bool
   * @param {Boolean} not
   * @returns {Criteria}
   */
  between(expr, values, bool = 'and', not = false) {
    return this.add(new Between(expr, values, bool, not))
  }

  /**
   * 
   * @param {String|Expression} expr
   * @param {Array} values
   * @returns {Criteria}
   */
  orBetween(expr, values) {
    return this.between(expr, values, 'or')
  }

  /**
   * 
   * @param {String|Expression} expr
   * @param {Array} values
   * @param {Boolean} bool
   * @returns {Criteria}
   */
  notBetween(expr, values, bool = 'and') {
    return this.between(expr, values, bool, true)
  }

  /**
   * 
   * @param {String|Expression} expr
   * @param {Array} values
   * @returns {Criteria}
   */
  orNotBetween(expr, values) {
    return this.notBetween(expr, values, 'or')
  }
  
  /**
   * 
   * @param {String|Expression} expr
   * @param {String} bool
   * @param {Boolean} not
   * @returns {Criteria}
   */
  isNull(expr, bool = 'and', not = false) {
    return this.add(new IsNull(expr, bool, not))
  }

  /**
   * 
   * @param {String|Expression} expr
   * @returns {Criteria}
   */
  orIsNull(expr) {
    return this.isNull(expr, 'or')
  }

  /**
   * 
   * @param {String|Expression} expr
   * @param {String} bool
   * @returns {Criteria}
   */
  isNotNull(expr, bool = 'and') {
    return this.isNull(expr, bool, true)
  }

  /**
   * 
   * @param {String|Expression} expr
   * @returns {Criteria}
   */
  orIsNotNull(expr) {
    return this.isNotNull(expr, 'or')
  }
  
  /**
   * @param {String|Expression} expr
   * @param {Array|SubQuery} values
   * @param {String} bool
   * @param {Boolean} not
   * @returns {Criteria}
   */
  in(expr, values, bool = 'and', not = false) {
    // instead of an empty array of values, a boolean expression is used
    if ( isArray(values) && isEmpty(values) )
      return this.where(not)
    
    // accepts sub queries
    if (! isArray(values) ) {
      let operator = (not ? 'not ' : '') + 'in'
      
      return this.where(expr, operator, SQ(values), bool)
    }
    
    return this.add(new IsIn(expr, values, bool, not))
  }

  /**
   * @param {String|Expression} expr
   * @param {Array|SubQuery} values
   * @returns {Criteria}
   */
  orIn(expr, values) {
    return this.in(expr, values, 'or')
  }

  /**
   * @param {String|Expression} expr
   * @param {Array|SubQuery} values
   * @param {String} bool
   * @returns {Criteria}
   */
  notIn(expr, values, bool = 'and') {
    return this.in(expr, values, bool, true)
  }

  /**
   * @param {String|Expression} expr
   * @param {Array|SubQuery} values
   * @returns {Criteria}
   */
  orNotIn(expr, values) {
    return this.notIn(expr, values, 'or')
  }
  
  /**
   * 
   * @param {SubQuery} query
   * @param {String} bool
   * @param {Boolean} not
   * @returns {Criteria}
   */
  exists(query, bool = 'and', not = false) {
    return this.add(new Exists(SQ(query), bool, not))
  }

  /**
   * 
   * @param {SubQuery} query
   * @returns {Criteria}
   */
  orExists(query) {
    return this.exists(query, 'or')
  }

  /**
   * 
   * @param {SubQuery} query
   * @param {String} bool
   * @returns {Criteria}
   */
  notExists(query, bool = 'and') {
    return this.exists(query, bool, true)
  }

  /**
   * 
   * @param {SubQuery} query
   * @returns {Criteria}
   */
  orNotExists(query) {
    return this.notExists(query, 'or')
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
      expr = new Column(value)
    
    if ( value instanceof Expression )
      throw new TypeError("Invalid column expression")
    
    return this.add(new Basic(expr, operator, value, bool))
  }
  
  /**
   * @see `on()`
   */
  andOn() {
    return this.on(...arguments)
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