
import { each, isBoolean, isEmpty, isPlainObject, isArray, isFunction, isString } from 'lodash'
import Criterion, { IsNull, Basic, IsIn, Raw, Between, Exists } from './index'
import { Raw as RawExpr, Column, SubQuery } from '../expression/index'
import { Select } from '../query/index'

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
    
    this.builder = null
    this.components = []
    this.negate = negate ? 'not ' : ''
  }
  
  /**
   * 
   * @param {Builder} value
   * @return this
   */
  setBuilder(value) {
    this.builder = value
    return this
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
   * @param {String} bool
   * @param {Boolean} not
   * @return Criteria instance
   */
  newCriteria(bool = 'and', not = false) {
    return new Criteria(bool, not)
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
   * @return this
   */
  where(expr, operator, value, bool = 'and', not = false) {
    if ( value == null && operator != null ) {
      value = operator
      operator = '='
    }
    
    // supports `.where(Boolean)`
    if ( isBoolean(expr) )
      return this.raw('1 = ' + expr ? 1 : 0)
    
    // supports `.where(new RawExpr(...))`
    if ( expr instanceof RawExpr )
      return this.raw(expr, [], bool)
    
    // supports `.where({a: 1, b: 3})`
    if ( isPlainObject(expr) ) {
      let obj = expr
      
      expr = cr => each(obj, (val, key) => cr.where(key, '=', val))
    }
    
    // supports `.where(cr => { ... })`
    if ( isFunction(expr) ) {
      let fn = expr
      
      fn(expr = this.newCriteria(bool, not))
      
      return this.add(expr)
    }
    
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
    if (
      isFunction(value) ||
      value instanceof Select ||
      value instanceof SubQuery
    ) return this.sub(expr, operator, value, bool)
    
    return this.add(new Basic(expr, operator, value, bool, not))
  }
  
  /**
   * @alias `where()`
   */
  and() {
    return this.where(...arguments)
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @return this
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
   * @return this
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
   * @alias `not()`
   */
  andNot() {
    return this.not(...arguments)
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @return this
   */
  orNot(expr, operator, value) {
    return this.not(expr, operator, value, 'or')
  }
  
  /**
   * 
   * @param {String|Raw} expr
   * @param {Array} bindings
   * @param {String} bool
   * @return this
   */
  raw(expr, bindings = [], bool = 'and') {
    return this.add(new Raw(this.builder.ensureRaw(expr, bindings), bool))
  }
  
  /**
   * 
   * @param {String|Raw} expr
   * @param {Array} bindings
   * @return this
   */
  orRaw(expr, bindings = []) {
    return this.raw(expr, bindings, 'or')
  }
  
  /**
   * @alias `raw()`
   */
  andRaw() {
    return this.raw(...arguments)
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {Array} values
   * @param {String} bool
   * @param {Boolean} not
   * @return this
   */
  between(expr, values, bool = 'and', not = false) {
    return this.add(new Between(expr, values, bool, not))
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {String} bool
   * @param {Boolean} not
   * @return this
   */
  isNull(expr, bool = 'and', not = false) {
    return this.add(new IsNull(expr, bool, not))
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {String} operator
   * @param {Any} query
   * @param {String} bool
   * @return this
   */
  sub(expr, operator, query, bool = 'and') {
    query = this.builder.ensureSubQuery(query)
    
    return this.add(new Basic(expr, operator, query, bool))
  }
  
  /**
   * @param {String|Column} expr
   * @param {Array|SubQuery} values
   * @param {String} bool
   * @param {Boolean} not
   * @return this
   */
  in(expr, values, bool = 'and', not = false) {
    // instead of an empty array of values, a boolean expression is used
    if ( isArray(values) && isEmpty(values) ) return this.where(not)
    
    // accepts sub queries
    if (! isArray(values) ) {
      let operator = not ? 'not ' : '' + 'in'
      
      return this.sub(expr, operator, values, bool)
    }
    
    return this.add(new IsIn(expr, values, bool, not))
  }
  
  /**
   * 
   * @param {SubQuery} query
   * @param {String} bool
   * @param {Boolean} not
   * @return this
   */
  exists(query, bool = 'and', not = false) {
    query = this.ensureSubQuery(query)
    
    return this.add(new Exists(query, bool, not))
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {String} operator
   * @param {String|Column} value
   * @param {String} bool
   * @return this
   */
  on(expr, operator, value, bool = 'and') {
    if ( value == null && operator != null ) {
      value = operator
      operator = '='
    }
    
    if ( isString(value) ) expr = new Column(value)
    
    if ( value instanceof Column )
      throw new TypeError("Invalid column expression")
    
    return this.add(new Basic(expr, operator, value, bool))
  }
  
  /**
   * 
   * @param {String|Column} expr
   * @param {String} operator
   * @param {String|Column} value
   * @return this
   */
  orOn(expr, operator, value) {
    return this.on(expr, operator, value, 'or')
  }
  
  /**
   * @alias `on()`
   */
  andOn() {
    return this.on(...arguments)
  }
  
}