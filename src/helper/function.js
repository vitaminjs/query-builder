
import { func } from './expression'

/**
 * @param {Any} expr
 * @returns {Func}
 */
export function abs (expr) {
  return func('abs', expr)
}

/**
 * @param {Any} x
 * @param {Integer} y
 * @returns {Func}
 */
export function round (x, y) {
  return func('round', x, y)
}

/**
 * A random float number between 0 and 1
 *
 * @returns {Func}
 */
export function rand () {
  return func('rand')
}

/**
 * @alias `RAND`
 */
export function random () {
  return rand(...arguments)
}

/**
 * @param {String|Expression} expr
 * @return {Func}
 */
export function upper (expr) {
  return func('upper', expr)
}

/**
 * @alias `UPPER`
 */
export function ucase () {
  return upper(...arguments)
}

/**
 * @param {String|Expression} expr
 * @return {Func}
 */
export function lower (expr) {
  return func('lower', expr)
}

/**
 * @alias `LOWER`
 */
export function lcase () {
  return lower(...arguments)
}

/**
 * @param {String|Expression} args
 * @returns {Func}
 */
export function concat (...args) {
  return func('concat', ...args)
}

/**
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function length (expr) {
  return func('length', expr)
}

/**
 * @alias `LENGTH`
 */
export function len () {
  return length(...arguments)
}

/**
 * @param {String|Expresion} expr
 * @param {Any} pattern
 * @param {Any} replacement
 * @returns {Func}
 */
export function replace (expr, pattern, replacement) {
  return func('replace', expr, pattern, replacement)
}

/**
 * @param {String|Expression} expr
 * @param {Integer} start
 * @param {Integer} length
 * @returns {Func}
 */
export function substr (expr, start, length) {
  if (length == null) {
    return func('substr', expr, start)
  } else {
    return func('substr', expr, start, length)
  }
}

/**
 * @alias `SUBSTR`
 */
export function substring () {
  return substr(...arguments)
}

/**
 * @param {String|Expression} expr
 * @param {Integer} length
 * @returns {Func}
 */
export function left (expr, length) {
  return func('left', expr, length)
}

/**
 * @param {String|Expression} expr
 * @param {Integer} length
 * @returns {Func}
 */
export function right (expr, length) {
  return func('right', expr, length)
}

/**
 * @param {String|Expresion} expr
 * @returns {Func}
 */
export function trim (expr) {
  return func('trim', expr)
}

/**
 * @param {String|Expresion} expr
 * @returns {Func}
 */
export function ltrim (expr) {
  return func('ltrim', expr)
}

/**
 * @param {String|Expresion} expr
 * @returns {Func}
 */
export function rtrim (expr) {
  return func('rtrim', expr)
}

/**
 * @param {String|Expresion} str
 * @param {String|Expresion} substr
 * @returns {Func}
 */
export function strpos (str, substr) {
  return func('strpos', str, substr)
}

/**
 * @alias `STRPOS`
 */
export function position () {
  return strpos(...arguments)
}

/**
 * @param {String|Expression} expr
 * @param {Integer} count
 * @returns {Func}
 */
export function repeat (expr, count) {
  return func('repeat', expr, count)
}

/**
 * @param {Integer} length
 * @returns {Func}
 */
export function space (length) {
  return func('space', length)
}

/**
 * Returns the current local date and time in 'YYYY-MM-DD HH:MM:SS' format
 *
 * @returns {Func}
 */
export function now () {
  return func('now')
}

/**
 * @alias `NOW`
 */
export function datetime () {
  return now()
}

/**
 * Returns the current UTC date and time in 'YYYY-MM-DD HH:MM:SS' format
 *
 * @returns {Func}
 */
export function utc () {
  return func('utc')
}

/**
 * @param {Any} expr
 * @returns {Func}
 */
export function date (expr) {
  return func('date', expr)
}

/**
 * Returns the current date in 'YYYY-MM-DD' format
 *
 * @returns {Func}
 */
export function today () {
  return func('current_date')
}

/**
 * @alias `TODAY`
 */
export function curdate () {
  return today()
}

/**
 * @param {Any} expr
 * @returns {Func}
 */
export function time (expr) {
  return func('time', expr)
}

/**
 * @returns {Func}
 */
export function clock () {
  return func('current_time')
}

/**
 * @returns {Func}
 */
export function curtime () {
  return clock()
}

/**
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function day (expr) {
  return func('day', expr)
}

/**
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function month (expr) {
  return func('month', expr)
}

/**
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function year (expr) {
  return func('year', expr)
}

/**
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function hour (expr) {
  return func('hour', expr)
}

/**
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function minute (expr) {
  return func('minute', expr)
}

/**
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function second (expr) {
  return func('second', expr)
}
