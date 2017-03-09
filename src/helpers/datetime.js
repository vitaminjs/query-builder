
import Expression, { Func, Literal } from '../expression'

/**
 * Returns the current local date and time in 'YYYY-MM-DD HH:MM:SS' format
 * 
 * @returns {Func}
 */
export function NOW() {
  return createFunction('now')
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
  return createFunction('utc')
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
  return createFunction('date', ensureExpression(expr))
}

/**
 * Returns the current date in 'YYYY-MM-DD' format
 * 
 * @returns {Func}
 */
export function TODAY() {
  return createFunction('current_date')
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
  return createFunction('time', ensureExpression(expr))
}

/**
 * 
 * @returns {Func}
 */
export function CLOCK() {
  return createFunction('current_time')
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
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function DAY(expr) {
  return createFunction('day', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function MONTH(expr) {
  return createFunction('month', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function YEAR(expr) {
  return createFunction('year', ensureExpression(expr))
}

/**
 * 
 * @param {String} name
 * @param {Array} args
 * @returns {Func}
 */
function createFunction(name, ...args) {
  return new Func(name, ...args)
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