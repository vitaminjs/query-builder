
import Expression, { Func, Literal } from '../expression'

/**
 * Returns the current local date and time in 'YYYY-MM-DD HH:MM:SS' format
 * 
 * @returns {Func}
 */
export function NOW() {
  return new Func('now')
}

/**
 * 
 * @see `NOW`
 */
export function DATETIME() {
  return NOW()
}

/**
 * Returns the current UTC date and time in 'YYYY-MM-DD HH:MM:SS' format
 * 
 * @returns {Func}
 */
export function UTC() {
  return new Func('utc')
}

/**
 * 
 * @see `UTC`
 */
export function UTC_DATETIME() {
  return UTC()
}

/**
 * 
 * @param {Any} expr
 * @returns {Func}
 */
export function DATE(expr) {
  return new Func('date', ensureExpression(expr))
}

/**
 * Returns the current date in 'YYYY-MM-DD' format
 * 
 * @returns {Func}
 */
export function TODAY() {
  return new Func('current_date')
}

/**
 * 
 * @see `TODAY`
 */
export function CURRENT_DATE() {
  return TODAY()
}

/**
 * 
 * @param {Any} expr
 * @returns {Func}
 */
export function TIME(expr) {
  return new Func('time', ensureExpression(expr))
}

/**
 * 
 * @returns {Func}
 */
export function CLOCK() {
  return new Func('current_time')
}

/**
 * 
 * @returns {Func}
 */
export function CURRENT_TIME() {
  return CLOCK()
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