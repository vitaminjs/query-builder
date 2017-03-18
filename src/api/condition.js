
import { Basic, Between, Exists, Raw } from '../criterion'
import Expression, { Literal } from '../expression'
import { isArray, isString, uniq } from 'lodash'
import { sq } from './expression'

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function eq(expr, value) {
  return createBasicCriterion(expr, '=', value)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function ne(expr, value) {
  return createBasicCriterion(expr, '!=', value)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function gt(expr, value) {
  return createBasicCriterion(expr, '>', value)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function lt(expr, value) {
  return createBasicCriterion(expr, '<', value)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function gte(expr, value) {
  return createBasicCriterion(expr, '>=', value)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function lte(expr, value) {
  return createBasicCriterion(expr, '<=', value)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} values
 * @returns {Criterion}
 */
export function $in(expr, values) {
  return createBasicCriterion(expr, 'in', isArray(values) ? uniq(values) : sq(values))
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} lower
 * @param {Any} higher
 * @returns {Criterion}
 */
export function between(expr, lower, higher) {
  return new Between(ensureExpression(expr), [lower, higher])
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
  return createBasicCriterion(expr, 'like', pattern)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {String} value
 * @returns {Criterion}
 */
export function startsWith(expr, value) {
  return like(expr, value.replace(/(_|%)/g, '\\$1') + '%')
}

/**
 * 
 * @param {String|Expression} expr
 * @param {String} value
 * @returns {Criterion}
 */
export function endsWith(expr, value) {
  return like(expr, '%' + value.replace(/(_|%)/g, '\\$1'))
}

/**
 * 
 * @param {String|Expression} expr
 * @param {String} operator
 * @param {Any} value
 * @returns {Basic}
 */
function createBasicCriterion(expr, operator, value) {
  return new Basic(ensureExpression(expr), operator, value)
}

/**
 * 
 * @param {Any} value
 * @returns {Expression}
 * @throws {TypeError}
 */
function ensureExpression(value) {
  return value instanceof Expression ? value : Literal.from(value)
}