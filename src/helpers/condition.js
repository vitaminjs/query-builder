
import { Basic, IsNull, IsIn, Between, Exists, Like } from '../criterion'
import { RAW, SQ } from './expression'
import { isArray } from 'lodash'

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function EQ(expr, value) {
  return new Basic(expr, '=', value)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function NE(expr, value) {
  return new Basic(expr, '!=', value)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function GT(expr, value) {
  return new Basic(expr, '>', value)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function LT(expr, value) {
  return new Basic(expr, '<', value)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function GTE(expr, value) {
  return new Basic(expr, '>=', value)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} value
 * @return {Criterion}
 */
export function LTE(expr, value) {
  return new Basic(expr, '<=', value)
}

/**
 * 
 * @param {String|Expression} expr
 * @returns {Criterion}
 */
export function ISNULL(expr) {
  return new IsNull(expr)
}

/**
 * 
 * @returns {Criterion}
 */
export function ISTRUE() {
  return RAW`1 = 1`
}

/**
 * 
 * @returns {Criterion}
 */
export function ISFALSE() {
  return RAW`1 = 0`
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} values
 * @returns {Criterion}
 */
export function IN(expr, values) {
  if (! isArray(values) ) values = SQ(values)

  return new IsIn(expr, values)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Any} lower
 * @param {Any} higher
 * @returns {Criterion}
 */
export function BETWEEN(expr, lower, higher) {
  return new Between(expr, [lower, higher])
}

/**
 * 
 * @param {Any} query
 * @returns {Criterion}
 */
export function EXISTS(query) {
  return new Exists(SQ(query))
}

/**
 * 
 * @param {String|Expression} expr
 * @param {String} patern
 * @returns {Criterion}
 */
export function LIKE(expr, patern) {
  return new Like(expr, patern)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {String} value
 * @returns {Criterion}
 */
export function STARTSWITH(expr, value) {
  return LIKE(expr, value.replace(/(_|%)/g, '\\$1') + '%')
}

/**
 * 
 * @param {String|Expression} expr
 * @param {String} value
 * @returns {Criterion}
 */
export function ENDSWITH(expr, value) {
  return LIKE(expr, '%' + value.replace(/(_|%)/g, '\\$1'))
}
