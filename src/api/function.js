
import Expression, { Literal, Func } from '../expression'

/**
 * 
 * @param {Any} expr
 * @returns {Func}
 */
export function abs(expr) {
  return createFunction('abs', expr)
}

/**
 * 
 * @param {Any} x
 * @param {Integer} y
 * @returns {Func}
 */
export function round(x, y) {
  return createFunction('round', x, y)
}

/**
 * A random float number between 0 and 1
 * 
 * @returns {Func}
 */
export function rand() {
  return createFunction('rand')
}

/**
 * 
 * @see `RAND`
 */
export function random() {
  return rand(...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Func}
 */
export function upper(expr) {
  return createFunction('upper', ensureExpression(expr))
}

/**
 * 
 * @see `UPPER`
 */
export function ucase() {
  return upper(...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Func}
 */
export function lower(expr) {
  return createFunction('lower', ensureExpression(expr))
}

/**
 * 
 * @see `LOWER`
 */
export function lcase() {
  return lower(...arguments)
}

/**
 * 
 * @param {String|Expression} args
 * @returns {Func}
 */
export function concat(...args) {
  return createFunction('concat', ...args)
}

/**
 * 
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function length(expr) {
  return createFunction('length', ensureExpression(expr))
}

/**
 * 
 * @see `LENGTH`
 */
export function len() {
  return langth(...arguments)
}

/**
 * 
 * @param {String|Expresion} expr
 * @param {Any} pattern
 * @param {Any} replacement
 * @returns {Func}
 */
export function replace(expr, pattern, replacement) {
  return createFunction('replace', ensureExpression(expr), pattern, replacement)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Integer} start
 * @param {Integer} length
 * @returns {Func}
 */
export function substr(expr, start, length) {
  if ( length == null )
    return createFunction('substr', ensureExpression(expr), start)
  else
    return createFunction('substr', ensureExpression(expr), start, length)
}

/**
 * 
 * @see `SUBSTR`
 */
export function substring() {
  return substr(...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Integer} length
 * @returns {Func}
 */
export function left(expr, length) {
  return createFunction('left', ensureExpression(expr), length)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Integer} length
 * @returns {Func}
 */
export function right(expr, length) {
  return createFunction('right', ensureExpression(expr), length)
}

/**
 * 
 * @param {String|Expresion} expr
 * @returns {Func}
 */
export function trim(expr) {
  return createFunction('trim', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expresion} expr
 * @returns {Func}
 */
export function ltrim(expr) {
  return createFunction('ltrim', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expresion} expr
 * @returns {Func}
 */
export function rtrim(expr) {
  return createFunction('rtrim', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expresion} str
 * @param {String|Expresion} substr
 * @returns {Func}
 */
export function strpos(str, substr) {
  return createFunction('strpos', ensureExpression(str), substr)
}

/**
 * 
 * @see `STRPOS`
 */
export function position() {
  return strpos(...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Integer} count
 * @returns {Func}
 */
export function repeat(expr, count) {
  return createFunction('repeat', ensureExpression(expr), count)
}

/**
 * 
 * @param {Integer} length
 * @returns {Func}
 */
export function space(length) {
  return createFunction('space', length)
}

/**
 * Returns the current local date and time in 'YYYY-MM-DD HH:MM:SS' format
 * 
 * @returns {Func}
 */
export function now() {
  return createFunction('now')
}

/**
 * 
 * @see `NOW`
 */
export function datetime() {
  return now()
}

/**
 * Returns the current UTC date and time in 'YYYY-MM-DD HH:MM:SS' format
 * 
 * @returns {Func}
 */
export function utc() {
  return createFunction('utc')
}

/**
 * 
 * @param {Any} expr
 * @returns {Func}
 */
export function date(expr) {
  return createFunction('date', ensureExpression(expr))
}

/**
 * Returns the current date in 'YYYY-MM-DD' format
 * 
 * @returns {Func}
 */
export function today() {
  return createFunction('current_date')
}

/**
 * 
 * @see `TODAY`
 */
export function curdate() {
  return today()
}

/**
 * 
 * @param {Any} expr
 * @returns {Func}
 */
export function time(expr) {
  return createFunction('time', ensureExpression(expr))
}

/**
 * 
 * @returns {Func}
 */
export function clock() {
  return createFunction('current_time')
}

/**
 * 
 * @returns {Func}
 */
export function curtime() {
  return clock()
}

/**
 * 
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function day(expr) {
  return createFunction('day', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function month(expr) {
  return createFunction('month', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function year(expr) {
  return createFunction('year', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function hour(expr) {
  return createFunction('hour', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function minute(expr) {
  return createFunction('minute', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function second(expr) {
  return createFunction('second', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expresion} expr
 * @returns {Expresion}
 * @private
 */
function ensureExpression(expr) {
  return expr instanceof Expression ? expr : Literal.from(expr)
}

/**
 * 
 * @param {String} name
 * @param {Array} args
 * @returns {Func}
 * @private
 */
function createFunction(name, ...args) {
  return new Func(name, ...args)
}