
import { Literal, Func } from '../expression'
import { RAW } from './expression'
import { isString } from 'lodash'

/**
 * 
 * @param {String|Expression} expr
 * @return {Func}
 */
export function UPPER(expr) {
  return new Func('upper', expr)
}

/**
 * 
 * @see `UPPER`
 */
export function UCASE() {
  return UPPER(...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Func}
 */
export function LOWER(expr) {
  return new Func('lower', expr)
}

/**
 * 
 * @see `LOWER`
 */
export function LCASE() {
  return LOWER(...arguments)
}

/**
 * 
 * @param {String|Expression} args
 * @returns {Func}
 */
export function CONCAT(...args) {
  return new Func('concat', ...args)
}

/**
 * 
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function LENGTH(expr) {
  return new Func('length', expr)
}

/**
 * 
 * @see `LENGTH`
 */
export function LEN() {
  return LENGTH(...arguments)
}

/**
 * 
 * @param {String|Expresion} expr
 * @param {Any} pattern
 * @param {Any} replacement
 * @returns {Func}
 */
export function REPLACE(expr, pattern, replacement) {
  return new Func('replace', expr, pattern, replacement)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Integer} start
 * @param {Integer} length
 * @returns {Func}
 */
export function SUBSTR(expr, start, length) {
  if ( length == null )
    return new Func('substr', expr, start)
  else
    return new Func('substr', expr, start, length)
}

/**
 * 
 * @see `SUBSTR`
 */
export function SUBSTRING() {
  return SUBSTR(...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Integer} length
 * @returns {Func}
 */
export function LEFT(expr, length) {
  return new Func('left', expr, length)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Integer} length
 * @returns {Func}
 */
export function RIGHT(expr, length) {
  return new Func('right', expr, length)
}

/**
 * 
 * @param {String|Expresion} expr
 * @returns {Func}
 */
export function TRIM(expr) {
  return new Func('trim', expr)
}

/**
 * 
 * @param {String|Expresion} expr
 * @returns {Func}
 */
export function LTRIM(expr) {
  return new Func('ltrim', expr)
}

/**
 * 
 * @param {String|Expresion} expr
 * @returns {Func}
 */
export function RTRIM(expr) {
  return new Func('rtrim', expr)
}

/**
 * 
 * @param {String|Expresion} str
 * @param {String|Expresion} substr
 * @returns {Func}
 */
export function STRPOS(str, substr) {
  return new Func('strpos', str, substr)
}

/**
 * 
 * @see `STRPOS`
 */
export function POSITION() {
  return STRPOS(...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Integer} count
 * @returns {Func}
 */
export function REPEAT(expr, count) {
  return new Func('repeat', expr, count)
}

/**
 * 
 * @param {Integer} length
 * @returns {Func}
 */
export function SPACE(length) {
  return Func('space', length)
}