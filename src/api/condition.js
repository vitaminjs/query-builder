
import { isArray, isPlainObject, isFunction, isString, each, uniq } from 'lodash'
import { Basic, Between, Exists, Criteria } from '../criterion'
import Expression, { Literal } from '../expression'
import { concat } from './function'
import { sq } from './expression'

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function eq(expr, value) {
  return createBasicCriterion('=', ...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function ne(expr, value) {
  return createBasicCriterion('!=', ...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function gt(expr, value) {
  return createBasicCriterion('>', ...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function lt(expr, value) {
  return createBasicCriterion('<', ...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function gte(expr, value) {
  return createBasicCriterion('>=', ...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function lte(expr, value) {
  return createBasicCriterion('<=', ...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} values
 * @returns {Criterion}
 */
exports['in'] = exports.$in = function $in(expr, values) {
  if ( arguments.length === 1 ) {
    values = expr
    expr = null
  }
  
  values = isArray(values) ? uniq(values) : sq(values)
  
  return createBasicCriterion('in', expr, values)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} min
 * @param {Any} max
 * @returns {Criterion}
 */
export function between(expr, min, max) {
  if ( arguments.length === 2 ) {
    max = min
    min = expr
    expr = null
  }
  
  if ( expr )
    expr = ensureExpression(expr)
  
  return new Between(expr, min, max)
}

/**
 * 
 * @param {Any} query
 * @returns {Criterion}
 */
export function exists(query) {
  return new Exists(sq(query))
}

/**
 * 
 * @param {String|Expression} expr
 * @param {String} pattern
 * @returns {Criterion}
 */
export function like(expr, pattern) {
  return createBasicCriterion('like', ...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {String|Expression} value 
 * @returns {Criterion}
 */
export function contains(expr, value) {
  if ( arguments.length === 1 ) {
    value = expr
    expr = null
  }

  if ( isString(value) )
    return like(expr, `%${escapeLike(value)}%`)
  
  return like(expr, concat('%', value, '%'))
}

/**
 * 
 * @param {String|Expression} expr
 * @param {String|Expression} value
 * @returns {Criterion}
 */
export function startsWith(expr, value) {
  if ( arguments.length === 1 ) {
    value = expr
    expr = null
  }

  if ( isString(value) )
    return like(expr, `${escapeLike(value)}%`)
  
  return like(expr, concat(value, '%'))
}

/**
 * 
 * @param {String|Expression} expr
 * @param {String|Expression} value
 * @returns {Criterion}
 */
export function endsWith(expr, value) {
  if ( arguments.length === 1 ) {
    value = expr
    expr = null
  }

  if ( isString(value) )
    return like(expr, `%${escapeLike(value)}`)
  
  return like(expr, concat('%', value))
}

/**
 * Noop helper
 * 
 * @param {Criterion|Object|Function} value
 * @returns {Criterion}
 */
export function and(value) {
  if ( isPlainObject(value) ) {
    let obj = value
    
    value = cr => each(obj, (v, k) => cr.where(k, v))
  }

  if ( isFunction(value) ) {
    let fn = value

    fn(value = new Criteria())
  }
  
  return value
}

/**
 * Use `or` as separator for a plain object of conditions
 * 
 * @param {Object} value
 * @returns {Criterion}
 */
export function or(value) {
  if ( isPlainObject(value) ) {
    let obj = value
    
    value = cr => each(obj, (v, k) => cr.orWhere(k, v))
  }
  
  return and(value)
}

/**
 * Negate a criterion object, by calling the `negate()` method
 * 
 * @param {Criterion} value
 * @returns {Criterion}
 */
export function not(value) {
  if ( null === value ) value = eq(value)

  return and(value).negate()
}

/**
 * 
 * @param {String} operator
 * @param {String|Expression} expr
 * @param {Any} value
 * @returns {Basic}
 * @private
 */
function createBasicCriterion(operator, expr, value) {
  if ( arguments.length === 2 ) {
    value = expr
    expr = null
  }
  
  if ( expr )
    expr = ensureExpression(expr)
  
  return new Basic(expr, operator, value)
}

/**
 * 
 * @param {Any} value
 * @returns {Expression}
 * @private
 */
function ensureExpression(value) {
  return value instanceof Expression ? value : Literal.from(value)
}

/**
 * 
 * @param {String} value
 * @returns {String}
 */
function escapeLike(value) {
  return value.replace(/[_%]/g, '\\$&')
}
