
import { Basic, Between, Exists } from '../criterion'
import Expression, { Literal } from '../expression'
import { isArray, uniq } from 'lodash'
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
 * @param {String} value
 * @returns {Criterion}
 */
export function startsWith(expr, value) {
  if ( arguments.length === 1 ) {
    value = expr
    expr = null
  }
  
  return like(expr, value.replace(/(_|%)/g, '\\$1') + '%')
}

/**
 * 
 * @param {String|Expression} expr
 * @param {String} value
 * @returns {Criterion}
 */
export function endsWith(expr, value) {
  if ( arguments.length === 1 ) {
    value = expr
    expr = null
  }
  
  return like(expr, '%' + value.replace(/(_|%)/g, '\\$1'))
}

/**
 * 
 * @param {String} operator
 * @param {String|Expression} expr
 * @param {Any} value
 * @returns {Basic}
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
 */
function ensureExpression(value) {
  return value instanceof Expression ? value : Literal.from(value)
}