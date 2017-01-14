
import { Basic } from '../criterion'

/**
 * 
 * @param {String|Expression} first
 * @param {Any} second
 * @return {Criterion}
 */
export function EQ(first, second) {
  return new Basic(first, '=', second)
}

/**
 * 
 * @param {String|Expression} first
 * @param {Any} second
 * @return {Criterion}
 */
export function NE(first, second) {
  return new Basic(first, '!=', second)
}

/**
 * 
 * @param {String|Expression} first
 * @param {Any} second
 * @return {Criterion}
 */
export function GT(first, second) {
  return new Basic(first, '>', second)
}

/**
 * 
 * @param {String|Expression} first
 * @param {Any} second
 * @return {Criterion}
 */
export function LT(first, second) {
  return new Basic(first, '<', second)
}

/**
 * 
 * @param {String|Expression} first
 * @param {Any} second
 * @return {Criterion}
 */
export function GTE(first, second) {
  return new Basic(first, '>=', second)
}

/**
 * 
 * @param {String|Expression} first
 * @param {Any} second
 * @return {Criterion}
 */
export function LTE(first, second) {
  return new Basic(first, '<=', second)
}
